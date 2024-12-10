import { PlusCircleIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useRef, useState } from 'react'
import { useFetcher } from 'react-router-dom'
import { calculateSpentByBudget } from '../helpers';

const AddExpenseForm = ({budgets}) => {
    const fetcher = useFetcher();
    const isSubmitting = fetcher.state === "submitting";

    const formRef = useRef();
    const focusRef = useRef();
    const [isBudgetOverflow, setIsBudgetOverflow] = useState(false);


    useEffect(() => {
        if (!isSubmitting) {
          // clear form
          formRef.current.reset()
          // reset focus
          focusRef.current.focus()
        }
        const isOverflow = budgets.every(
          (budget) => calculateSpentByBudget(budget.id) >= budget.amount
        );
        setIsBudgetOverflow(isOverflow);
    
      }, [isSubmitting,budgets])
  return (
    <div className='form-wrapper'>
      <h2 className="h3">Add New
        <span className="accent">
            {budgets.length === 1 && `${budgets.map((budg)=> budg.name)}`}
        </span>{" "}
        Expense
      </h2>
      <fetcher.Form method='post' className='grid-sm' ref={formRef} >
      <div className="expense-inputs">
          <div className="grid-xs">
            <label htmlFor="newExpense">Expense Name</label>
            <input
              type="text"
              name="newExpense"
              id="newExpense"
              placeholder="e.g., Coffee"
              ref={focusRef}
              required
            />
          </div>
          <div className="grid-xs">
            <label htmlFor="newExpenseAmount">Amount</label>
            <input
              type="number"
              step="0.01"
              inputMode="decimal"
              name="newExpenseAmount"
              id="newExpenseAmount"
              placeholder="e.g., 3.50"
              required
            />
          </div>
        </div>
        <div className="grid-xs" hidden={budgets.length === 1}>
          <label htmlFor="newExpenseBudget">Budget Category</label>
          <select name="newExpenseBudget" id="newExpenseBudget" required>
          {budgets
              .filter(budget => calculateSpentByBudget(budget.id) < budget.amount) // Filter out fully spent budgets
              .map(budget => (
                <option key={budget.id} value={budget.id}>
                  {budget.name}
                </option>
              ))}
          </select>
        </div>
        <input type="hidden" name="_action" value="createExpense" />
        <button
          type="submit"
          className="btn btn--dark"
          disabled={isSubmitting || isBudgetOverflow} // Disable if submitting or all budgets are fully spent
        >
          {isSubmitting ? (
            <span>Submitting…</span>
          ) : (
            <>
              <span>Add Expense</span>
              <PlusCircleIcon width={20} />
            </>
          )}
        </button>
        {isBudgetOverflow && (
          <p className="error">
            All budgets are fully spent. Cannot add more expenses.
          </p>
        )}
      </fetcher.Form>
    </div>
  )
}

export default AddExpenseForm
