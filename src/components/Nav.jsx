import React from 'react'
import logomark from "../assets/logomark.svg";
import { Form, NavLink } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/solid'

const Nav = ({userName}) => {
  return (
    <nav>
      <NavLink
        to="/"
        aria-label='Go to Home'
      >
      <img src={logomark} alt="" height={30}/>
      <span>PennyTrack</span>
      </NavLink>

      {
        userName && (
            <Form
                method="post"
                action="/logout"
                onSubmit={(e)=> {
                    if(!confirm("Are you sure you want to log out?")) {
                        e.preventDefault();
                    }
                }}
            >
                <button type='submit' className='btn btn--warning'>
                    <span>Delete User</span>
                    <TrashIcon width={20}/>
                </button>
            </Form>
        )
      }
    </nav>
  )
}

export default Nav
