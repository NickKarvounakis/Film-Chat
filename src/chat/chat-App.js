import React from 'react'
import Chatkit from '@pusher/chatkit-client'

import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import RoomList from './components/RoomList'
import NewRoomForm from './components/NewRoomForm'
import Username from './components/username.js'

import { tokenUrl, instanceLocator } from './config'


import 'rodal/lib/rodal.css';

class ChatApp extends React.Component {

    constructor() {
        super()
        this.state = {
            roomId: null,
            messages: [],
            joinableRooms: [],
            joinedRooms: [],
            state: true,
            show:false
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.subscribeToRoom = this.subscribeToRoom.bind(this)
        this.getRooms = this.getRooms.bind(this)
        this.createRoom = this.createRoom.bind(this)
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
  this.setState({ show: false });
}

handleShow() {
  this.setState({ show: true });
}

    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator,
            userId: 'User1',
            tokenProvider: new Chatkit.TokenProvider({
                url: tokenUrl
            })

        })

        chatManager.connect()
        .then(currentUser => {
            this.currentUser = currentUser
            this.getRooms()
        })
        .catch(err => console.log('error on connecting: ', err))
    }
    // when a user clikcs to chat for a certain movie this component lifecycle method gets called
    componentWillReceiveProps(nextProps){
      if(nextProps.roomName!==this.props.roomName){
          this.createRoom(nextProps.roomName)
      }
    }









    getRooms() {
        this.currentUser.getJoinableRooms()
        .then(joinableRooms => {

            this.setState({
                joinableRooms,
                joinedRooms: this.currentUser.rooms
            })
        })
        .catch(err => console.log('error on joinableRooms: ', err))
    }

    subscribeToRoom(roomId) {
        this.setState({messages:[]})
        this.setState({ messages: [] })
        console.log(roomId)
        this.currentUser.subscribeToRoom({
            roomId: roomId,
            hooks: {
                onMessage: message => {
                    this.setState({
                        messages: [...this.state.messages, message],
                    })
                }
            }
        })
        .then(room => {
            this.setState({
                roomId: room.id
            })
            this.getRooms()
        })
        .catch(err => console.log('error on subscribing to room: ', err))
    }

    sendMessage(text) {
        this.currentUser.sendMessage({
            text,
            roomId: this.state.roomId
        })
    }

    createRoom(name){
            let index = false
            let id = ''
            this.state.joinedRooms.forEach((movie) => {
            if(name == movie.name)
              {
              index = true
              id = movie.id
              }
          })
          if(!index)  //ensures there isn't a chatroom for the same movie
            this.currentUser.createRoom({
              name
            })
            .then(room => this.subscribeToRoom(room.id))
            .catch(err => console.log('error with create room'))
          else      //if there is just join it
              (room => this.subscribeToRoom(id))
              (err => console.log('error with create room'))
        }


    render() {

        return (
            <div className="app">
                <RoomList
                    roomId={this.state.roomId}
                    subscribeToRoom={this.subscribeToRoom}
                    rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
                <MessageList
                roomId={this.state.roomId}
                messages={this.state.messages} />
                <SendMessageForm
                disabled={!this.state.roomId}
                sendMessage={this.sendMessage} />
                <NewRoomForm createRoom={this.createRoom}/>
                <Username onSubmit={this.handleShow} />
            </div>
        );
    }
}

export default ChatApp