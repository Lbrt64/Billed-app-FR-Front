/**
 * @jest-environment jsdom
 */

// import test tools
import { fireEvent, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'

// import mocked data
import { bills } from "../fixtures/bills.js"
import { chronoOrderedBills } from "../fixtures/chronoOrderedBills.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"

// import app logic
import { ROUTES_PATH} from "../constants/routes.js";
import NewBill from "../containers/NewBill.js";
import router from "../app/Router.js";
import { isImage } from "../app/utils.js";

// setup 
jest.mock("../app/store", () => mockStore)
const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}

describe("Given I am connected as an employee", () => {

    describe("When I am on New Bills Page", () => {
  
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
        window.onNavigate(ROUTES_PATH.NewBill)
      })
  
      test("Then the page title should be Envoyer une note de frais", () => {
        expect(screen.getByText(/Envoyer une note de frais/)).toBeTruthy()
      }) 

      describe("When I upload a file", () => {
        test("Then the handleChangeFile function should be called", () => {
            const file = new File(['document'], 'document.png')
            const input = screen.getByTestId('file')
            const handleChangeFile = jest.fn()
            input.addEventListener("change", handleChangeFile)
            userEvent.upload(input, file)
            expect(handleChangeFile).toHaveBeenCalled()
        })

        test("Then if the format is .png it should be accepted", async () => {
            const fileName = 'document.png'
            expect(isImage(fileName)).toBeTruthy();
        })

        test("Then if the format is .pdf it should be refused", async () => {
            const fileName = 'document.pdf'
            expect(isImage(fileName)).toBeFalsy();
        })

        // test("Then if the format is .pdf it should not be displayed on the page", () => {
        //     // définir valeur
        //     // handle
        // })
        }) 

      describe("When I submit the form", () => {
        test("Then handleSubmit function should be called and loading screen is displayed", () => {
            const formNewBill = screen.getByTestId('form-new-bill')
            const handleSubmit = jest.fn()
            const submitButton = screen.getByText('Envoyer', { exact: true })
            formNewBill.addEventListener('submit', handleSubmit)
            userEvent.click(submitButton)
            expect(handleSubmit).toHaveBeenCalled()
            })
        })
    })
})
  