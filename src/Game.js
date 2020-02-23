import React, { Component } from 'react';
import './Game.css';

// 棋盤格線設定
const line = 19;

function calculateWinner(history){
  const lines = [
    [0,1,2,3,4],
    [0,18,36,54,72],
    [0,19,38,57,76],
    [4,21,38,55,72]
  ];
  for(let i=0; i<lines.length; i++){
    const [a,b,c,d,e] = lines[i];
    for(let j=0; j<14; j++){ // 檢查橫向是否 win
      for(let k=0; k<21; k++){ // 檢查縱向是否 win
        if( history[a+j+(k*18)]
          && history[a+j+(k*18)] === history[b+j+(k*18)]
          && history[b+j+(k*18)] === history[c+j+(k*18)]
          && history[c+j+(k*18)] === history[d+j+(k*18)]
          && history[d+j+(k*18)] === history[e+j+(k*18)]
          ){
          return history[a+j+(k*18)];
        }
      }
    }
  }
  return false;
}

class Board extends Component {

  renderBtn(i){
    let piece = this.props.history[i] ? this.props.history[i] : '';
    return (
      <div className="btn boardLine" key={i}>
        <div className={`piece ${piece}`} onClick={()=>{this.props.handleClick(i)}}></div>
      </div>
    )
  }

  render(){
      let rowBoardRow = [];
      let n = 0;
      for(let i=0; i<18; i++){
        let rowBtn = [];
        for(let j=0; j<18; j++,n++){
          rowBtn.push(this.renderBtn(n))
        }
        rowBoardRow.push(<div className="boardRow" key={i}>{rowBtn}</div>)
      }
    return (
      <div className="board">
        {rowBoardRow}
      </div>
    )
  }
}

class Game extends Component {
  constructor(){
    super()
    this.state = {
      history: [{
        squares: Array(line * line).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      winner: null,
    }
    this.handleClick = this.handleClick.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.backOneStep = this.backOneStep.bind(this);
  }

  handleClick(i){
    const history = this.state.history;
    const current = history[history.length - 1];
    const currentSquares = current.squares.slice();
    if(calculateWinner(currentSquares) || currentSquares[i]){
      return
    }
    currentSquares[i] = this.state.xIsNext ? 'black' : 'white';
    this.setState({
      history: this.state.history.concat([{
        squares: currentSquares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  resetGame(){
    this.setState({
      history: [{squares: Array(line * line).fill(null)}],
      xIsNext: true,
      stepNumber: 0,
      winner: null,
    })
  }

  backOneStep(){
    const history = this.state.history;
    if(history.length<0){
      return
    }
    const backStep = history.slice(0,[history.length - 1]);
    this.setState({
      history: backStep,
      xIsNext: !this.state.xIsNext,
      stepNumber: (history.length-1) - 1,
    })
  }

  render() {
    console.log(this.state.history)
    console.log(this.state)
    const currentSquares = this.state.history[this.state.history.length - 1].squares;
    const winner = calculateWinner(currentSquares);
    const isHasBackStep = this.state.stepNumber > 0 ? 'Back Step' : '';
    let status = null;
    let reset = null;
    if(winner){
      status = "Winner: "+ winner;
      reset = "Reset Game";
    } else {
      status = "Next Player: " + (this.state.xIsNext ? "Black" : "White");
    }
    return (
      <div className="game">
        <div className="title">GOMOKU</div>
        <div className="player">{status}</div>
        <Board history={currentSquares} handleClick={this.handleClick} />
        <br />
        <div className="wrapper">
          <div className="backStep" onClick={this.backOneStep}>{isHasBackStep}</div>
          <div className="resetGame" onClick={this.resetGame}>{reset}</div>
        </div>
      </div>
    )
  }
}

export default Game;
