/**
 * @jest-environment jsdom
 */

import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import {fireEvent, screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { chronoOrderedBills } from "../fixtures/chronoOrderedBills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import Bills from "../containers/Bills.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
import isImage from "../app/utils.js"

jest.mock("../app/store", () => mockStore)
const store = mockStore
const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({ pathname })
}
const testNewBill = new NewBill({document, onNavigate, store, localStorageMock})


describe("Given I am connected as an employee", () => {
    let testNewBill = ''
    beforeEach(() => {
     Object.defineProperty(window, 'localStorage', { value: localStorageMock })
     window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
    }))
    const store = mockStore
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
    }
    testNewBill = new NewBill({document, onNavigate, store, localStorageMock})
    router()
    console.log(screen)
    // window.onNavigate(ROUTES_PATH.NewBill)
    })

    describe("When I am on new bills form page and load a new file", () => {

        test("Then if it's a png it appears in the form field", async () => {
            const handleChangeFile = jest.fn(testNewBill.handleChangeFile)
            const testFile = screen.getByTestId('file')
            testFile.addEventListener('change', handleChangeFile)
            fireEvent.change(inputFile, {
              target: {
                files: [new File(['file.png'], 'file.png')]
              }
            })
            expect(handleChangeFile).toHaveBeenCalled()
            })

//         test("Then if it is a pdf, the form field becomes empty", async () => {
//             expect()
//         })

//     })

//     describe("When I am on new bills form page and submit a bill", () => {
        
//         test("Then handleSubmit is called", async () => {
//           expect()
//         })

//         test("Then I am taken to the Bills page", async () => {
//           expect()
//         })

    })
})


// POST TEST