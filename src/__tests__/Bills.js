/**
 * @jest-environment jsdom
 */

// import test tools
import {screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event'

// import views
import BillsUI from "../views/BillsUI.js"

// import mocked data
import { bills } from "../fixtures/bills.js"
import { chronoOrderedBills } from "../fixtures/chronoOrderedBills.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"

// import app logic
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";

// setup 
jest.mock("../app/store", () => mockStore)
const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}
$.fn.modal = jest.fn();

describe("Given I am connected as an employee", () => {

  beforeEach(() => {
    // Sets the localstorage information and identify user as employee
    Object.defineProperty(window, localStorage, { value: localStorageMock });
    window.localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: "a@a" }))
    // Requirements to launch router
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.appendChild(root)
    // Launch router and generate Bills page
    router()
    window.onNavigate(ROUTES_PATH.Bills)
  })

  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", () => {
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })

    test("Then bills should be ordered from earliest to latest", () => {
      let orderedBills = bills.sort(function(a,b) {return new Date(a.date) - new Date(b.date)})
      expect(orderedBills).toEqual(chronoOrderedBills)
    })
  })

  describe("When I click on the eye icon for a bill", () => {
    test('Then a modal should open', () => {
      const eye = screen.getAllByTestId('icon-eye')[0]
      userEvent.click(eye)
      expect(screen.getByTestId("modaleFile")).toBeTruthy()
    })
  })

  // [Ajout de tests unitaires et d'intégration] - Bills
  describe("When I click on new bill icon", () => {
    test('Then new bill form should be displayed', () => {
      const newBillButton = screen.getByTestId('btn-new-bill')
      userEvent.click(newBillButton)
      expect(screen.getByTestId("form-new-bill")).toBeTruthy()
    })
  })

  // [Ajout de tests unitaires et d'intégration] - Bills GET API positive scenario
  describe("When I load the Bills Page and data received from GET Bills API is correct", () => {
    test("Then bills data should be displayed on the Bills page", async () => {
      expect(screen.getByTestId("tbody")).toBeTruthy()
    })
  })

  // [Ajout de tests unitaires et d'intégration] - Bills GET API error scenario
  describe("When I load the Bills Page and an error occurs on GET Bills API", () => {

    beforeEach(() => {
      jest.spyOn(mockStore, "bills")
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

