import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Button from 'react-bootstrap/lib/Button';
import CarouselPageUser from './CarouselUser.jsx';
import Search from './Search.jsx';
import SignUp from './signUp.jsx';
import SearchListUser from './searchListUser.jsx';
import { Component } from 'react';
// import Login from './components/Login.jsx'
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Mount from './Mount.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Router, Switch, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router';

class userPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsBar: [],
      loaded: false,
      location: 'san francisco'
    }
  }

  changeLocation(location) {
    this.setState({
      location: location
    })
  }

  getEventful(category) {
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
          eventsBar: data.slice(0, 5)
        });
        // console.log(this.state.location, this.state.eventsBar);
      },
      error: () => {
        console.log('ajax failed at post request from Eventful');
      }
    })
  }

    changeLocation(location) {
      console.log(location);
      this.setState({
        location: location
      })
      console.log(this.state.location);
  }
  saveEvent(event) {
    console.log('USERNAME', window.username, 'Events', event);
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

  retrieveSavedEvents() {
    console.log(window.username);
    $.ajax({
      url: '/savedEvents',
      data: JSON.stringify({
        username: window.username
      }),
      type: 'POST',
      contentType: 'application/json',

      success: (events) => {
        console.log('ajax was successful at get request from Database', events);
        var data = JSON.parse(events);
        this.setState({
          eventsBar: data.slice(0, 5)
        });
      },
      error: () => {
        console.log('ajax failed at get request from Database');
      }
    })
  }

  render() {
    return (
      <div>
        <div className='titleContainer'>
          <PageHeader>
            <span className='title'>Event</span><span className='wire'>Wyre</span>
            <Button bsSize="small" className='login'>
                <Link to='/'>Logout</Link>
            </Button>
          </PageHeader>
        </div>
        <div>
          <CarouselPageUser />
        </div>
        <br></br>
        <div>
          <Search location={this.state.location} changeLocation ={this.changeLocation.bind(this)} />
          <SearchListUser retrieveEvents={this.retrieveSavedEvents.bind(this)} save={this.saveEvent.bind(this)} events={this.state.eventsBar} getEvents = {this.getEventful.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default userPage;