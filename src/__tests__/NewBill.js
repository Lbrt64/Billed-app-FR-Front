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

// // HandlechangeFile -> simulate file import
// // if fileName is .png => file.value should be true
// // if filename is .pdf => file.value should be false



describe("Given I am connected as an employee", () => {

    describe("When I am on new bills form page and load a new file", () => {

        test("Then if it's a png it appears in the form field", async () => {
        expect()
        })

        test("Then if it is a pdf, the form field becomes empty", async () => {
        expect()
        })

    })

    describe("When I am on new bills form page and submit a bill", () => {
        
        test("Then handleSubmit is called", async () => {
          expect()
        })

        test("Then I am taken to the Bills page", async () => {
          expect()
        })

    })
})


// POST TEST