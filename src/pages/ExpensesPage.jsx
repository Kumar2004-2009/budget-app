import React from "react";
import { deleteItem, fetchData } from "../helpers";
import { useLoaderData, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

export async function expensesLoader() {
  const expenses = await fetchData("expenses");
  return { expenses };
}

export async function expensesAction({request}) {
  const data=await request.formData();
  const {_action,...values}=Object.fromEntries(data);

  if(_action === "deleteExpense"){
    try{
      deleteItem({
        key:"expenses",
        id:values.expenseId
      })
      
      return toast.success(`Expense deleted successfully`);
    }
    catch(error){
      throw new Error("There was a problem with your request")
    }
  }
}


const ExpensesPage = () => {
  const { expenses } = useLoaderData();
  const navigate = useNavigate();
  return (
    <div className="grid-lg">
      <h1>All Expenses</h1>
      {expenses && expenses.length > 0 ? (
        <>
          <div className="grid-md">
            <h2>
              Recent Expenses <small>({expenses.length} total)</small>
            </h2>
            <Table expenses={expenses} />
          </div>

          <div className="flex-md">
            <button className="btn btn--dark" onClick={() => navigate(-1)}>
              <ArrowUturnLeftIcon width={20} />
              <span>Go Back</span>
            </button>
          </div>
        </>
      ) : (
        <p>No expenses to show</p>
      )}
    </div>
  );
};

export default ExpensesPage;
