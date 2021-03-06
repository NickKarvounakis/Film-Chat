import React,{ Component } from 'react'
import ReactDOM from 'react-dom'
import Message from './Message'

class MessageList extends Component {

    componentWillUpdate = () => {
      const node = ReactDOM.findDOMNode(this)
      node.scrollTop = node.scrollHeight
    }

    componentDidUpdate = () => {
      if(this.shouldScrollToBottom){
        const node = ReactDOM.findDOMNode(this)
        node.scrollTop = node.scrollHeight
      }
    }

    renderUserMessage = () => {
      if (this.props.messages.length !== 0) {
        return(
        this.props.messages.map(message => {
              return ( <Message key={message.id} username={message.senderId} text={message.text} /> )
        })
        );
      } else {
        return (
          <div className="center">
            <h2 >No messages.Type something and be the first one !</h2>
          </div>
        );
      }
    }



    render() {
      if(!this.props.roomId){
          return(
          <div className="message-list">
              <div className="join-room">
                &larr;Join a room!
              </div>
          </div>
        )
      }
        return (
            <div className="message-list">
                <div style={{overflow:'scroll',height:'100%'}}>
                  {this.renderUserMessage()}
                </div>
            </div>
        )
    }
}

export default MessageList
