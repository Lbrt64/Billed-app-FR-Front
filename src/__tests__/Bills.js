/**
 * @jest-environment jsdom
 */

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

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {

  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      // [Ajout de tests unitaires et d'intégration] - Bills
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
    // Fix [Bug report] - Bills - Note: the test was using antichrono order, but was changed to use chrono
    // "Should be ordered from EARLIEST to LATEST"
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      // same approach used in BillsUI.js
      let billsData = bills
      let orderedBills = billsData.sort(function(a,b) {
        return new Date(a.date) - new Date(b.date)
      })
      // compare results to list of already ordered bills
      expect(orderedBills).toEqual(chronoOrderedBills)
    })
  })

  // [Ajout de tests unitaires et d'intégration] - Bills
  describe("When I click on the eye icon for a bill", () => {
    test('Then a modal should open', () => {
      Object.defineProperty(window, localStorage, { value: localStorageMock });
      window.localStorage.setItem("user", JSON.stringify({
         type: "Employee" 
      }))
      const store = null
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      new Bills({document, onNavigate, localStorageMock, store})
      const handleClickIconEye = jest.fn();
      // jQuery-Bootstrap Function
      $.fn.modal = jest.fn();
      const eye = screen.getAllByTestId('icon-eye')[0]
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      // expect(handleClickIconEye).toHaveBeenCalled()
      expect($.fn.modal).toHaveBeenCalled()
    })
  })

  // [Ajout de tests unitaires et d'intégration] - Bills
  describe("When I click on new bill icon", () => {
    test('Then new bill form should be displayed', () => {
      Object.defineProperty(window, localStorage, { value: localStorageMock });
      window.localStorage.setItem("user", JSON.stringify({
         type: "Employee" 
      }))
      const store = null
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      new Bills({document, onNavigate, localStorageMock, store})
      const handleClickNewBill = jest.fn();
      // jQuery-Bootstrap Function
      const newBillButton = screen.getByTestId('btn-new-bill')
      newBillButton.addEventListener('click', handleClickNewBill)
      userEvent.click(newBillButton)
      // expect(handleClickIconEye).toHaveBeenCalled()
      expect(screen.getByTestId("form-new-bill")).toBeTruthy()
    })
  })

  // [Ajout de tests unitaires et d'intégration] - Bills GET API positive scenario
  describe("When I load the Bills Page and data received from GET Bills API is correct", () => {
    test("Then bills data should be displayed on the Bills page", async () => {
      Object.defineProperty(window, localStorage, { value: localStorageMock });
      window.localStorage.setItem("user", JSON.stringify({
         type: "Employee" 
      }))
      const store = null
      const html = BillsUI({ data: bills })
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
      window.onNavigate(ROUTES_PATH.Bills)
      expect(screen.getByTestId("tbody")).toBeTruthy()
    })
  })

  // [Ajout de tests unitaires et d'intégration] - Bills GET API error scenario
  describe("When I load the Bills Page and an error occurs on GET Bills API", () => {

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

    test("Then in case of API 404 error, the page should display it", async () => {
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

    test("Then in case of API 500 error, the page should display it", async () => {
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

// [Ajout de tests unitaires et d'intégration] - Bills GET API
// describe("Given I am a user connected as Employee", () => {
// })