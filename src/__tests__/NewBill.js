/**
 * @jest-environment jsdom
 */

// import test tools
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'

// import mocked data
import { bills } from "../fixtures/bills.js"
import { chronoOrderedBills } from "../fixtures/chronoOrderedBills.js"
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"

// import app logic
import { ROUTES_PATH, ROUTES } from "../constants/routes.js";
import router from "../app/Router.js";
import { isImage } from "../app/utils.js";
import NewBillUI from "../views/NewBillUI";
import { BillsUI } from "../views/BillsUI";
import Bills  from "../containers/Bills.js"
import ErrorPage from "../views/ErrorPage";
import NewBill from "../containers/NewBill.js";

// setup 
jest.mock("../app/store", () => mockStore)
$.fn.modal = jest.fn();
const onNavigate = (pathname) => {document.body.innerHTML = ROUTES({ pathname })}

describe("Given I am connected as an employee", () => {

    describe("When I am on New Bills Page", () => {
  
      beforeEach(() => {
        Object.defineProperty(window, localStorage, { value: localStorageMock });
        window.localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: "a@a" }))
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.appendChild(root)
        router()
        window.onNavigate(ROUTES_PATH.NewBill)
      })
  
      test("Then the page title should be Envoyer une note de frais", () => {
        expect(screen.getByText(/Envoyer une note de frais/)).toBeTruthy()
      }) 

      describe("When I upload a file", () => {

        beforeEach(() => {
            document.body.innerHTML = '' 
            Object.defineProperty(window, localStorage, { value: localStorageMock });
            window.localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: "a@a" }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            root.setAttribute("data-testid", "root")
            document.body.appendChild(root)
            router()
            window.onNavigate(ROUTES_PATH.NewBill)
          })

        test("Then the handleChangeFile function should be called", async () => {
            const handleChange = jest.fn()
            const file = new File(['image.jpg'], 'image.jpg')
            const input = screen.getByTestId('file')
            input.addEventListener("change", handleChange)
            userEvent.upload(input, file)   
            expect(handleChange).toHaveBeenCalled()
        })

        test("Then the file name should appear on the page", async () => {
            const file = new File(['image.jpg'], 'image.jpg')
            const input = screen.getByTestId('file')
            userEvent.upload(input, file)
            expect(input.files[0].name).toBe("image.jpg");
        })

        test("Then no file name should appear when the format is wrong", async () => {
            const file = new File(['image.jpg'], 'image.jpg')
            const input = screen.getByTestId('file')
            userEvent.upload(input, file)
            expect(file.value).toBe(undefined);
        })
    }) 

    
      describe("When I submit the form", () => {

        test("Then handleSubmit function should be called", () => {
            const formNewBill = screen.getByTestId('form-new-bill')
            const handleSubmit = jest.fn()
            const submitButton = screen.getByText('Envoyer', { exact: true })
            formNewBill.addEventListener('submit', handleSubmit)
            userEvent.click(submitButton)
            expect(handleSubmit).toHaveBeenCalled()
            })
        })

        // [Ajout de tests unitaires et d'intégration] - Bills POST API positive scenario
        describe("When sending the form via POST Bills API with correct data", () => {

            beforeEach(() => {
                Object.defineProperty(window, localStorage, { value: localStorageMock });
                window.localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: "a@a" }))
                const root = document.createElement("div")
                root.setAttribute("id", "root")
                document.body.appendChild(root)
                router()
                window.onNavigate(ROUTES_PATH.NewBill)
                jest.spyOn(mockStore, "bills")
            })

            test("Then the user is taken to the Bills page", async () => {
                mockStore.bills.mockImplementationOnce(() => {
                    return { 
                        list : () =>  {return Promise.resolve()}, 
                        update : () =>  {return Promise.resolve()} 
                    }
                })
                const formNewBill = screen.getByTestId('form-new-bill')   
                fireEvent.submit(formNewBill)
                await new Promise(process.nextTick);
                expect(screen.getByTestId("tbody")).toBeTruthy()
            })
        })
        
        // [Ajout de tests unitaires et d'intégration] - Bills POST API error scenario
        describe("When an error occurs on GET Bills API", () => {
        
            beforeEach(() => {
                Object.defineProperty(window, localStorage, { value: localStorageMock });
                window.localStorage.setItem('user', JSON.stringify({ type: 'Employee', email: "a@a" }))
                const root = document.createElement("div")
                root.setAttribute("id", "root")
                document.body.appendChild(root)
                router()
                window.onNavigate(ROUTES_PATH.NewBill)
                jest.spyOn(mockStore, "bills")
            })
        
            test("Then in case of API 500 error, the page should display it", async () => {
                mockStore.bills.mockImplementationOnce(() => {
                    return { 
                        update : () =>  {return Promise.reject(new Error("Erreur 500"))}, 
                        list : () =>  {return Promise.resolve()} 
                    }
                })
                const formNewBill = screen.getByTestId('form-new-bill')   
                fireEvent.submit(formNewBill)
                await new Promise(process.nextTick);
                const message = waitFor(() => screen.getByText(/Erreur 500/))
                expect(message).toBeTruthy()
            })
        })
    })
})
  