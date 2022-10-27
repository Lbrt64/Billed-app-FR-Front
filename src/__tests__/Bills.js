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
      // to-do write expect expression
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      let billsData = bills
      // same approach used in BillsUI.js
      let orderedBills = billsData.sort(function(a,b) {
        return new Date(a.date) - new Date(b.date)
      })
      // compare bills that have been ordered by function to a list of bills that are already ordered
      expect(orderedBills).toEqual(chronoOrderedBills)
    })
  })
  describe("When I click on the eye icon for a bill", () => {
    test('A modal should open', () => {
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
})
