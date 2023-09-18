import React, { useState } from "react";
import { SubNavbar } from "../../components";
import { accountSubNavLinks } from "../../utils";
import "./PurchaseHistory.scss";
import { DataGrid } from "@mui/x-data-grid";
import { axiosPublic } from "../../api/apiMethod";
import moment from "moment/moment";
import { toast } from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const PurchaseHistory = () => {
  useDocumentTitle(`Purchased History - Webdev Skool`)
  const [orders, setOrders] = useState([]);

  const [pageSize, setPageSize] = useState(10);
  const queryClient = useQueryClient();

  const fetchOrder = async () => {
    const { data: {orders} } = await axiosPublic.get(`/order/userOrder`);
    return orders
  };

  const { isLoading } = useQuery({
    queryKey: ['order-history'],
    queryFn: () => fetchOrder(),
    onSuccess: (data) => {
      setOrders(
       data?.map(order => {
          return {
            id: order?.courseId._id,
            courseId: order?.courseId._id,
            amount: order?.courseId?.price,
            title: order?.courseId?.title,
            ...order,
          };
        })
      );
      return orders; 
    },
  })

  const refundMutation = useMutation({
    mutationFn: async (item) => {
      return await axiosPublic.post(`/payment/refund`, {paymentId: item?.paymentId, amount:item?.courseId?.price})
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order-history'] })
      toast.success('Successfully refunded')
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message)
    }
  })

  const orderColumn = [
    {
      field: "orderId",
      headerName: "Order ID",
      minWidth: 100,
      flex: 1,
      sortable: false
    },
    {
      field: "title",
      headerName: "Title",
      minWidth: 180,
      flex: 1,
      sortable: false,
    },
    {
      field: "purchasedDate",
      headerName: "Enrollment Date",
      minWidth: 120,
      flex: 1,
      renderCell: (params) => {
        return <>{moment(params.row.purchasedDate).format("DD.MM.YYYY")}</>;
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 100,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return <>Rs.{params.row.amount}</>;
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {params.row.status === "Enrolled" ? (
              <p style={{ color: "#44da44", fontWeight: "600" }}>Enrolled</p>
            ) : (
              <p style={{ color: "#da4444" }}>Refunded</p>
            )}
          </>
        );
      },
    },
    {
      field: "",
      headerName: "Get Refund",
      minWidth: 120,
      sortable: false,
      flex: 1,
      renderCell: (params) => {
        const { orderId, status} = params.row

        //get order with same orderId 
        const duplicateOrderId = orders?.filter((item, i, arr) => {
          return arr.slice(i + 1).some((e) => e.orderId === item.orderId)
        })?.some(el => el.orderId === orderId)

        return (
          <>
            {(new Date(params.row.refundAvailableTill) > new Date() && status !== 'Refunded' && !duplicateOrderId)  
              ? <button className="button" onClick={() => refundMutation.mutate(params.row)}>Refund</button>
              : new Date(params.row.refundAvailableTill) < new Date() && params.row.status === 'Enrolled' && !duplicateOrderId
                ? <div></div>
                : duplicateOrderId
                ? <button className="refund-disable" disabled>Disabled</button>
                : <p className="refunded">Refunded</p>
            }
          </>
        );
      },
    },
  ];

  return (
    <>
      <SubNavbar title="Account" links={accountSubNavLinks} />

      <div className="purchase-history_container">
        {orders?.length > 0 ? (
          <DataGrid
            rows={orders}
            columns={orderColumn}
            disableRowSelectionOnClick={true}
            rowsPerPageOptions={[10, 20, 25]}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            pageSize={pageSize}
            autoHeight={true}
            initialState={{
              sorting: {
                sortModel: [
                  {
                    field: "purchasedDate",
                    sort: "desc",
                  },
                ],
              },
            }}
            sx={{
              ".MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "&.MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#e93369",
                color: "#fff",
              },
              "&": {
                boxShadow: "1px 1px 12px 4px #e9e9e9",
              },
            }}
          />
        ) : (
          <h1 className="empty-content">No Records Found!!!</h1>
        )}
      </div>
    </>
  );
};

export default PurchaseHistory;
