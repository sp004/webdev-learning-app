import { render, screen } from "@testing-library/react";
import Login from "./Login";

// import * as apiRequestModule from "../api/apiMethod";

// jest.mock("axios", () => ({
//     __esModule: true,
  
    // default: {
    //   get: () => ({
    //     data: { id: 1, name: "John" },
    //   }),
    // },
// }));

jest.mock("axios")

test('Enter valid email', () => {
    // apiRequestModule.axiosPublic.create.mockReturnValue({})
    render(<Login />)
    const emailElement = screen.getByLabelText('Enter Email')
    expect(emailElement).toBeInTheDocument()
});
