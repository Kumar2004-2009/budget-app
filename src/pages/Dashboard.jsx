import React from 'react'
import { calculateSpentByBudget, createBudget, createExpense, deleteItem, fetchData, waait } from '../helpers'
import { Link, useLoaderData } from 'react-router-dom';
import Intro from '../components/Intro';
import { toast } from 'react-toastify';
import AddBudgetForm from '../components/AddBudgetForm';
import AddExpenseForm from '../components/AddExpenseForm';
import BudgetItem from '../components/BudgetItem';
import Table from '../components/Table';

// loader
export function dashboardLoader() {
    const userName = fetchData('userName');
    const budgets = fetchData('budgets');
    const expenses = fetchData('expenses');
    return { userName, budgets,expenses }
}

// actions
export async function dashBoardAction({request}) {
  await waait();

  const data=await request.formData();
  const {_action,...values}=Object.fromEntries(data);
  if(_action === "newUser"){
    try {
      localStorage.setItem("userName",JSON.stringify(values.userName));
      return toast.success(`Welcome , ${values.userName}`)
    } catch (error) {
      throw new Error("There was a problem with your request")
    }
  }
  
  if(_action === "createBudget"){
    try{
      // create a budget
      createBudget({
        name:values.newBudget,
        amount:values.newBudgetAmount
      })
      return toast.success("Budget created successfully");
    }
    catch(error){
      throw new Error("There was a problem with your request")
    }
  }

  if(_action === "createExpense"){
    try{
      const budgetId = values.newExpenseBudget;
    const budget = fetchData("budgets").find(budget => budget.id === budgetId);
    const spent = calculateSpentByBudget(budgetId);

    const newExpenseAmount = parseFloat(values.newExpenseAmount);

    if (spent + newExpenseAmount > budget.amount) {
      return toast.error(`Budget overflow! You cannot exceed the budget .`);
    }
      // create a expense
    else{
      createExpense({
        name:values.newExpense,
        amount:values.newExpenseAmount,
        budgetId:values.newExpenseBudget
      })
      
      return toast.success(`Expense ${values.newExpense} created successfully`);
    }
    }
    catch(error){
      throw new Error(error.message)
    }
  }

  if(_action === "deleteExpense"){
    try{
      // create a expense
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

const Dashboard = () => {
    const { userName,budgets,expenses } = useLoaderData()
  return (
    <>
      {userName ?(
        <div className='dashboard'>
          <h1>Welcome <span className='accent'>{userName}</span></h1>

          <div className='grid-sm'>
            
            { budgets && budgets.length > 0 ?
                (<div className="grid-lg">
                  <div className="flex-lg">
                    <AddBudgetForm/>
                    <AddExpenseForm budgets={budgets}/>
                  </div>
                  <h2>Existing Budgets</h2>
                  <div className='budgets'>
                    {
                      budgets.map((budget)=>(
                        <BudgetItem key={budget.id} budget={budget} />
                      ))
                    }
                  </div>
                  {
                    expenses && expenses.length > 0 && (
                      <div className='grid-md'>
                        <h2>Recent Expenses</h2>
                        <Table expenses={expenses.sort((a,b)=>b.createdAt - a.createdAt).slice(0,6)}/>
                        { expenses.length > 6 && <Link to="expenses" className='btn btn--dark'>View All Expenses</Link>}
                      </div>
                    )
                  }
                </div>)
                :(
                  <div className="grid-sm">
                    <p>Personal budgeting is the secret to financial freedom</p>
                    <p>Create your first budget below</p>
                    <AddBudgetForm/>
                  </div>
                )
            }
          </div>
        </div>
      ) :<Intro/>}
    </>
  )
}

export default Dashboard
