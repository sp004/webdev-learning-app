"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import './AdminAction.scss'

const AdminAction = ({ id }) => {
  console.log("😎😎", id);
  const [openRejectWindow, setOpenRejectWindow] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false)
  const router = useRouter();

  const approveCourse = async () => {
    setIsApproveLoading(true);
    const res = await fetch(
      `/api/course/approve/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      },
      { cache: "no-cache" }
    );
    console.log("😎😎", res);
    // const data = await res.json()
    // console.log(data)
    if (!res.ok){
      setIsApproveLoading(false)
      throw new Error("Something went wrong")
    } 
    toast.success("Course approved successfully");
    setIsApproveLoading(false);
    router.push("/pending-approval");
    return res.json();
  };

  const submitRejectHandler = async (e) => {
    e.preventDefault();

    setIsRejectLoading(true);
    setOpenRejectWindow((prev) => !prev);
    // isLoading && toast.loading('Request processing')

    const res = await fetch(
      `/api/course/reject/${id}`,
      {
        method: "POST",
        body: JSON.stringify({ reason: rejectReason }),
        headers: { "Content-Type": "application/json" },
      },
      { cache: "no-cache" }
    );
console.log(res)
    if (!res.ok) {
      // throw new Error("Something went wrong");
      setIsRejectLoading(false)
      toast.error('Something went wrong');
      return
    }
    const data = await res.json();

    setRejectReason("");
    setOpenRejectWindow((prev) => !prev);

    setIsRejectLoading(false);
    !isRejectLoading && toast.success("Course rejected");
    res?.ok && router.push("/pending-approval");

    return data;
  };

  return (
    <div className="buttons">
      <div className="action">
        <button className="approve" onClick={approveCourse}>{isApproveLoading ? 'Processing' : 'Approve'}</button>
        <button className="reject" onClick={() => setOpenRejectWindow((prev) => !prev)}>{isRejectLoading ? 'Processing' : 'Reject'}</button>
      </div>
      {openRejectWindow && (
        <form onSubmit={submitRejectHandler}>
          <textarea
            name="rejectReason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows="8"
            placeholder="Reason of rejection"
          />
          <button>Submit</button>
        </form>
      )}
    </div>
  );
};

export default AdminAction;
