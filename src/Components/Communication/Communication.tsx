import * as React from "react";
import { connect } from "react-redux";
import { IState } from "../../Store/reducer";
import { Dispatch } from "redux";
import { sendMessageComplete, sendMessage } from '../../Store/actions';
import { IWebsocketMessage } from "../../Interfaces/IRequestData";
import { EWSClientType } from "../../Enums/EWSClientType";
import { EWSMessageType } from "../../Enums/EWSMessageType";
interface ICommunicationState {
  [key: string]: any;
}
interface ICommunicationProps {
  [key: string]: any;
  ws_message: string;
  ws_message_sent: boolean;
  sendMessageComplete: Function;
  sendMessage: Function;
}

class Communication extends React.Component<
  ICommunicationProps,
  ICommunicationState
> {
  ws: WebSocket;
  constructor(props: ICommunicationProps) {
    super(props);
    this.ws = new WebSocket(
      "wss://cs70esocmi.execute-api.us-east-1.amazonaws.com/dev"
    );
  }

  componentDidMount() {
    this.ws.onopen = event => {
      const message: IWebsocketMessage = {
        client_type: EWSClientType.DISPLAY,
        message: EWSMessageType.INITIALISE,
        raspberry_pi_id: process.env.REACT_APP_RASPBERRY_PI_ID
          ? parseInt(process.env.REACT_APP_RASPBERRY_PI_ID)
          : 1
      };

      let string = JSON.stringify(message);
      this.ws.send(string);
    };

    this.ws.onmessage = event => {
      let message: IWebsocketMessage = JSON.parse(event.data);

      switch (message.message) {
        case EWSMessageType.START_STREAM:
          console.log("START STREAM");
          this.props.sendMessage(event.data);
          break;
        case EWSMessageType.STOP_STREAM:
          console.log("STOP STREAM");
          break;
        case EWSMessageType.START_PLAYLIST:
          console.log("START_PLAYLIST");
          break;
        case EWSMessageType.STOP_PLAYLIST:
          console.log("STOP_PLAYLIST");
          break;
        default:
            console.log('NOT ACTIONABLE');
            break;
      }
    };
  }

  sendMessage = () => {
    if (this.ws.OPEN) {
      this.ws.send(this.props.ws_message);
      this.props.sendMessageComplete();
    }
  };

  render() {
    return <> </>;
  }
}

const mapStateToProps = (state: IState) => {
  return {
    ws_message: state.ws_message,
    ws_message_sent: state.ws_message_sent
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    sendMessageComplete: () => dispatch(sendMessageComplete()),
    sendMessage: (message: string) => dispatch(sendMessage(message))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Communication);
