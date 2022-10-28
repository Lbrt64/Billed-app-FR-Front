// /**
//  * @jest-environment jsdom
//  */

// import NewBillUI from "../views/NewBillUI.js"
// import NewBill from "../containers/NewBill.js"
// import {fireEvent, screen, waitFor} from "@testing-library/dom"
// import userEvent from '@testing-library/user-event'
// import BillsUI from "../views/BillsUI.js"
// import { bills } from "../fixtures/bills.js"
// import { chronoOrderedBills } from "../fixtures/chronoOrderedBills.js"
// import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
// import Bills from "../containers/Bills.js";
// import {localStorageMock} from "../__mocks__/localStorage.js";
// import mockStore from "../__mocks__/store"
// import router from "../app/Router.js";
// import isImage from "../app/utils.js"

// jest.mock("../app/store", () => mockStore)

// describe("Given I am connected as an employee", () => {
//   describe("When I am on NewBill Page", () => {
//     test("Then if I upload a png file it should be accepted", () => {
//       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
//       window.localStorage.setItem('user', JSON.stringify({
//         type: 'Employee'
//       }))
//       const root = document.createElement("div")
//       root.setAttribute("id", "root")
//       document.body.append(root)
//       router()
//       window.onNavigate(ROUTES_PATH.NewBillUI)
//       //to-do write assertion
//       const fileName = "document.png"
//       const handleSubmit = jest.fn(e)
//       const fileNameValidation = isImage(fileName)
//       expect(fileNameValidation).toBeTruthy()
//     })
//   })
// })

// // HandlechangeFile -> simulate file import
// // if fileName is .png => file.value should be true
// // if filename is .pdf => file.value should be false


// // handleSubmit -> use mocked data & submit 
// // Should display Bills page
