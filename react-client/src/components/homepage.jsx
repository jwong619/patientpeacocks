import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Button from 'react-bootstrap/lib/Button';
import CarouselPage from './Carousel.jsx';
import Search from './Search.jsx';
import SignUp from './signUp.jsx';
import SearchList from './searchList.jsx';
import { Component } from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Mount from './Mount.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Router, Switch, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

class homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsBar: [],
      loaded: false,
      location: 'san francisco',
      username: ''
    }
  }

  changeLocation(location) {
    console.log(location);
    this.setState({
      location: location
    })
    console.log(this.state.location);
}

  getEventful(category) {
    console.log(window.username);
    $.ajax({
      url: '/eventful',
      data: JSON.stringify({
        location: this.state.location,
        topic: category
      }),
      type: 'POST',
      contentType: 'application/json',

      success: (item) => {
        console.log('ajax was successful at post request from Eventful');
        var data = JSON.parse(item);
        this.setState({
          eventsBar: data.slice(0,10)
        })
      },
      error: () => {
        console.log('ajax failed at post request from Eventful');
      }
    })
  }

  saveEvent(event) {
    console.log(event, window.username)
    if(window.username !== '') {
      $.ajax({
        url: '/save',
        data: JSON.stringify({
          event: event,
          username: window.username
        }),
        contentType: 'application/json',
        type: 'POST',
        success: () => {
          console.log('Saved Event Properly');
        }
      })
    }
  }

  render() {
    return (
      <div className = 'pageContainer'>
        <div className='titleContainer'>
          <PageHeader >
            <span className='title'>Event</span><span className='wire'>Wyre</span>
            <Button bsSize="small" className='login'>
                <Link to='/login' >Login</Link>
            </Button>
            <Button bsSize="small" className ='signup'>
                <Link to='/signUP'>Sign Up</Link>
            </Button>
          </PageHeader>
        </div>
        <div>
          <CarouselPage />
        </div>
        <br></br>
        <div>
          <Search location={this.state.location} changeLocation ={this.changeLocation.bind(this)} />
          <SearchList save={this.saveEvent.bind(this)} events={this.state.eventsBar} getEvents = {this.getEventful.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default homepage;