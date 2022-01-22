import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC7cUL5bWXIiPBYV7H6zSU3odUrtNP55mQ",
  authDomain: "chitchat-f6202.firebaseapp.com",
  projectId: "chitchat-f6202",
  storageBucket: "chitchat-f6202.appspot.com",
  messagingSenderId: "129417189582",
  appId: "1:129417189582:web:5bcb6dde0c4fd59d38d89f"
};

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }

  if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
    }

  this.referenceChatMessages = firebase.firestore().collection("messages");

  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        // This next bit is the code for the system message that welcomes the user by name when they start chatting.
        // Note that I used this.props.route.params.name even though the instructions said to use this.props.navigation.state.params.name;
        // I couldn't get that to work.
        {
         _id: 2,
         text: 'Hello ' + this.props.route.params.name + '. Welcome to the chat!',
         createdAt: new Date(),
         system: true,
        },
      ],
    })


    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate)

  }

  addMessage() {
		const message = this.state.messages[0];
		// add a new message to the collection
		this.referenceChatMessages.add({
			_id: message._id,
			text: message.text || '',
			createdAt: message.createdAt,
			user: this.state.user,
		});
	}

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    this.addMessage();
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
  };

  // This is the function that makes the background color of the sender's text bubbles black instead of blue.
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  render() {
    let name = this.props.route.params.name; // OR ...
    // let { name } = this.props.route.params;

    this.props.navigation.setOptions({ title: name });

    const backgroundColor = this.props.route.params.backgroundColor;

    return (
      <View style={{flex:1}}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/* This code here is necessary to prevent the keyboard from blocking the input box on older Android phones. */}
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
       /* <View style={{
        flex: 1,
        alignItems:'center', 
        justifyContent:'center',
        backgroundColor: backgroundColor ? backgroundColor: '#fff',
      }}>
      </View> */
    );
  };
}