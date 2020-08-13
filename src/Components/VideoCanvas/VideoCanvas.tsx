import React from "react";
import styled from "styled-components";
import { Dispatch } from "redux";
import { IState } from '../../Store/reducer';
import { sendMessageComplete } from '../../Store/actions';
import { connect } from "react-redux";
import { IWebsocketMessage } from '../../Interfaces/IRequestData';
import { EWSMessageType } from "../../Enums/EWSMessageType";
import { IScreen } from "../../Interfaces/IScreen";
import { IPlaylistEntry } from '../../Interfaces/IPlaylistEntry';

const DivWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
`;

const ControlWrapper = styled.div`
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row;
  width: 100vw;
  height: 10vh;
  left: 0%;
  justify-content: space-around;
  :hover {
    cursor: pointer;
    font-style: italic;
  }
`;

const ControlText = styled.p`
  color: rgb(0, 255, 0);
`;
interface VideoCanvasProps {
  [propName: string]: any;
  ws_message: string;
  ws_message_sent: boolean;
  sendMessageComplete: Function;
  screens: IScreen[]
}

interface VideoCanvasState {
  width: number;
  height: number;
  index: number;
  isStreaming: boolean;
  streamUrl: string;
  playlist: IPlaylistEntry[];
}
class VideoCanvas extends React.Component<
  VideoCanvasProps,
  VideoCanvasState
> {
  video: HTMLVideoElement | null = null;
  canvas: React.RefObject<HTMLCanvasElement>;
  canvasContext: CanvasRenderingContext2D | null = null;
  animation: number | null = null;
  alpha = 1;
  blur = 100;
  grayscale = 100;
  index = 0;

  playlist = [
    "http://10.0.0.111:8080/video",
  ];

  constructor(props: VideoCanvasProps) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      index: 0,
      isStreaming: false,
      streamUrl:
        "http://admin:false.memory@192.168.0.25/ISAPI/Streaming/channels/102/httpPreview",
        playlist: []
    };


    this.canvas = React.createRef();
  }
  componentDidMount() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
    this.createVideoElement();
    this.setVideoCanvasContext();



  }

  componentDidUpdate(prevProps: VideoCanvasProps) {
    if( this.props.ws_message_sent && (prevProps.ws_message_sent !== this.props.ws_message_sent)) {
      this.handleWebsocketMessage();
    }

    if(prevProps.screens.length === 0 && (this.props.screens !== prevProps.screens)) {
      let screen =  this.props.screens.find((scr)=> {
        return scr.raspberry_pi_id == 3
      })
      if(screen) {
        this.setState({
          playlist: screen.video_file_playlist
        })
        this.updateSource()
      }

    }
  }

  handleWebsocketMessage = () => {
    let wsMessage: IWebsocketMessage = JSON.parse(this.props.ws_message);
    switch (wsMessage.message) {
      case EWSMessageType.START_STREAM:
        this.startStream()
        console.log("START STREAM");
        break;
      case EWSMessageType.STOP_STREAM:
        this.startPlaylist();
        console.log("STOP STREAM");
        break;
      case EWSMessageType.START_PLAYLIST:
        this.startPlaylist();
        console.log("START_PLAYLIST");
        break;
      case EWSMessageType.STOP_PLAYLIST:
        this.stopPlaylist();
        console.log("STOP_PLAYLIST");
        break;
      default:
          console.log('NOT ACTIONABLE');
          break;
    }
    this.props.sendMessageComplete();
  }

  createVideoElement = () => {
    if (this.video) {
      this.video.remove();
    }
    this.video = document.createElement("video");
    this.video.setAttribute("width", "1");
    this.video.setAttribute("height", "1");
    this.video.setAttribute("display", "none");
    this.video.setAttribute("mute", "1");
    this.video.setAttribute("crossorigin", "anonymous");
    // let source = document.createElement("source");
    // if (this.state.isStreaming) {
    //   source.setAttribute("src", this.state.streamUrl);
    //   source.setAttribute("type", "video/mp4");
    // } else {
    //   source.setAttribute("src", this.state.playlist[this.index]);
    //   source.setAttribute("type", "video/mp4");
    // }
    // this.video.appendChild(source);
  };

  updateSource = () => {
    if(this.video) {
      let source = document.createElement("source");
      if (this.state.isStreaming) {
        source.setAttribute("src", this.state.streamUrl);
        source.setAttribute("type", "video/mp4");
      } else {
        if(this.state.playlist.length > 0) {
          let url = `http://10.0.0.111:8080/video/${this.state.playlist[this.index].id}`
          console.log('screen',url)
          source.setAttribute("src", url);
          source.setAttribute("type", "video/mp4");
        }
      }
      this.video.appendChild(source);
    }
  }

  setPlaylist = () => {};

  setVideoCanvasContext = () => {
    if (this.canvas && this.canvas.current) {
      this.canvasContext = this.canvas.current.getContext("2d", { alpha: false });
    }
  };

  fadeOut = () => {
    if (this.blur < 100) {
      this.blur = this.blur + 5;
    }
    this.updateFilter();
  };

  fadeIn = () => {
    if (this.blur > 5) {
      this.blur = this.blur - 5;
    }
    this.updateFilter();
  };

  updateFilter = () => {
    if (this.canvasContext) {
      // this.canvasContext.filter = `blur(${this.blur}%) grayscale${this.grayscale}%}`;
    }
  };

  startPlaylist = () => {
    this.updateSource()

    if (this.video) {
      this.video.currentTime = 0;
    }

    if (this.state.isStreaming) {
      this.setState({
        isStreaming: false
      });
    }

    this.startRender();
  };

  startStream = () => {
    if (!this.state.isStreaming) {
      this.setState({
        isStreaming: true
      });

      this.updateSource()
    }

    this.startRender();

  };

  stopPlaylist = () => {
    if (this.animation && this.video) {
      this.video.pause();
      this.setState({
        index: 0
      });
      cancelAnimationFrame(this.animation);
    }
  };

  renderVideoToCanvas = () => {
    if (this.canvasContext && this.video) {
      this.canvasContext.drawImage(
        this.video,
        0,
        0,
        this.state.width,
        this.state.height
      );
    }
  };

  incrementVideoIndex = () => {
    if (this.index + 1 === this.state.playlist.length) {
      this.index = 0;
    } else {
      this.index = this.index + 1;
    }
  };

  startRender = () => {
    if (this.video) {
      this.video.play();
      let percent = this.video.currentTime / this.video.duration;

      if (percent < 0.05) {
        this.fadeIn();
      }
      this.renderVideoToCanvas();

      if (percent > 0.9) {
        this.fadeOut();
      }

      if (percent >= 0.99) {
        this.incrementVideoIndex();
        this.video.pause();
        this.updateSource();
      }

      this.animation = requestAnimationFrame(this.startRender);
    }
  };

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {

    return (
      <DivWrapper>
        <canvas
          ref={this.canvas}
          width={this.state.width}
          height={this.state.height}
        />
        <ControlWrapper>
          <ControlText onClick={this.startPlaylist}>Start Playlist</ControlText>
          <ControlText onClick={this.stopPlaylist}>Stop Playlist</ControlText>
          <ControlText>Start Livestream</ControlText>
          <ControlText>Stop Livestream</ControlText>
        </ControlWrapper>
      </DivWrapper>
    );
  }
}

const mapStateToProps = (state: IState) => {
  return {
    ws_message: state.ws_message,
    ws_message_sent: state.ws_message_sent,
    screens: state.screens
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    sendMessageComplete: () => dispatch(sendMessageComplete())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoCanvas);
