import React from 'react'
import { Form } from 'react-router-dom'
import { UserPlusIcon } from '@heroicons/react/24/solid'
import illustration from '../assets/illustration.jpg'

const Intro = () => {
  return (
    <div className='intro'>
      <div>
        <h1>
        Track your expenses, <span className='accent'>Shape Your Future</span>
        </h1>
        <p>
            Personal budgeting is the secret to financial freedom.
        </p>
        <Form method="post">
            <input type='text' name='userName' required placeholder='What is your name?' aria-label="Enter your name" autoComplete='given-name'/>
            <input type="hidden" name='_action' value='newUser'/>
            <button type='submit' className='btn btn--dark'><span>Get Started</span><UserPlusIcon width={20}/></button>
        </Form>
      </div>
      <img src={illustration} alt="Person with money" width={600} />
    </div>
  )
}

export default Intro
