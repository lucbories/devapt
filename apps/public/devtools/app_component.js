
import React from 'react'
// import document from 'react-dom'
import redux from 'redux'
import {Provider} from 'react-redux'

import * as create_store from '../../../common/store/create_store'



export default class Counter extends React.Component
{
  constructor(props)
  {
    super(props)
    this.state = this.getInitialState()
  }
  
  getInitialState()
  {
    return { clickCount: 0 }
  }
  
  handleClick()
  {
    this.setState(
      (state) => {
        return {clickCount: state.clickCount + 1}
      }
    )
  }
  
  render()
  {
    return (<h2 onClick={this.handleClick.bind(this)}>Click me! Number of clicks: {this.state.clickCount}</h2>)
  }
}

// console.log(document, 'document')
// const dest = document.getElementById('content')
const store = create_store(/*client, */__INITIAL_STATE__)

    // {() =>  }
const element = (
  <Provider store={store}>
    <Counter />
  </Provider>
)

React.render(element, document.getElementById('content'))
