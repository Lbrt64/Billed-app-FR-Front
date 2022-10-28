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

// HandlechangeFile -> simulate file import
// if fileName is .png => file.value should be true
// if filename is .pdf => file.value should be false


// handleSubmit -> use mocked data & submit 
// Should display Bills page

describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to New Bills Page", () => {
    test("Then at submit post bills from mock API POST", async () => {
      Object.defineProperty(window, localStorage, { value: localStorageMock });
      window.localStorage.setItem("user", JSON.stringify({
         type: "Employee" 
      }))
      const store = null
      const html = newBillsUI()
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      new Bills({document, onNavigate, localStorageMock, store})

      localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      expect(screen.getByTestId("tbody")).toBeTruthy()
    })
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills")
        Object.defineProperty(
            window,
            'localStorage',
            { value: localStorageMock }
        )
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee',
          email: "a@a"
        }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
      })
      test("Then fetch bills from an API and fails with 404 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 404"))
            }
          }})
        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })

      test("Then fetch messages from an API and fails with 500 message error", async () => {

        mockStore.bills.mockImplementationOnce(() => {
          return {
            list : () =>  {
              return Promise.reject(new Error("Erreur 500"))
            }
          }})

        window.onNavigate(ROUTES_PATH.Bills)
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})
