import { Route } from "react-router-dom";
import { UpdateBook } from "./UpdateBook";
import { useFetchBook } from "./useFetchBook";
import { useUpdateBook } from "./useUpdateBook";
import { BookForm } from "../shared/BookForm";
import { fireEvent, waitFor } from "@testing-library/react";

jest.mock("./useFetchBook", () => ({
  useFetchBook: jest.fn(),
}));

jest.mock("./useUpdateBook", () => ({
  useUpdateBook: jest.fn(),
}));

jest.mock("../shared/BookForm", () => ({
  BookForm: jest.fn(),
}));

describe("UpdateBook", () => {
  beforeEach(() => {
    useFetchBook.mockImplementation(() => ({}));
    useUpdateBook.mockImplementation(() => ({}));
    BookForm.mockImplementation(() => null);
  });
  it("fetches the book data for the given id", () => {
    renderWithRouter(
      () => (
        <Route path="/:id">
          <UpdateBook />
        </Route>
      ),
      "/test-book-id"
    );
    expect(useFetchBook).toHaveBeenCalledWith("test-book-id");
  });

  describe("while loading", () => {
    it("renders a loader", () => {
      useFetchBook.mockImplementation(() => ({
        isLoading: true,
      }));

      const { getByTestId } = renderWithRouter(
        () => (
          <Route path="/:id">
            <UpdateBook />
          </Route>
        ),
        "/test-book-id"
      );
      expect(getByTestId("loader")).toBeTruthy();
    });
  });

  describe("with an error", () => {
    it("renders an error message", () => {
      useFetchBook.mockImplementation(() => ({
        isError: true,
        error: { message: "Something went wrong" },
      }));

      const { container } = renderWithRouter(
        () => (
          <Route path="/:id">
            <UpdateBook />
          </Route>
        ),
        "/test-book-id"
      );
      expect(container.innerHTML).toMatch("Error: Something went wrong");
    });
  });

  describe("with data", () => {
    it("renders the update book title and the book form", () => {
      useFetchBook.mockImplementation(() => ({
        data: { foo: "bar" },
      }));

      const { container } = renderWithRouter(
        () => (
          <Route path="/:id">
            <UpdateBook />
          </Route>
        ),
        "/test-book-id"
      );
      expect(container.innerHTML).toMatch("Update Book");
      expect(BookForm).toBeCalledWith(
        expect.objectContaining({
          defaultValues: { foo: "bar" },
        }),
        {}
      );
    });

    describe("on book form submit", () => {
      it("updates the book data and navigates to the root page", async () => {
        BookForm.mockImplementation(({ onFormSubmit }) => (
          <button onClick={() => onFormSubmit({ foo: "bar" })}>Submit</button>
        ));
        const mutateAsync = jest.fn();

        useUpdateBook.mockImplementation(() => ({ mutateAsync }));

        const { getByText, history } = renderWithRouter(
          () => (
            <Route path="/:id">
              <UpdateBook />
            </Route>
          ),
          "/test-book-id"
        );

        fireEvent.click(getByText("Submit"));

        expect(mutateAsync).toHaveBeenCalledWith({
          foo: "bar",
          id: "test-book-id",
        });

        await waitFor(() => {
          expect(history.location.pathname).toEqual("/");
        });
      });
    });
  });
});
