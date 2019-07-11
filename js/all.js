class game{
  constructor(){
    this.totalTime=0;
    this.totalPoint=0;
    this.question=new questionMaker();
    this.answer;
    this.userAnswer;
    this.timeLeft=document.querySelector('.timeLeft');
    this.recordNumber=document.querySelector('.recordNumber');
    //倒數計時
    const timer=setInterval(() =>{
       //歸零時間
      let str; //時間字串
      if(this.totalTime == 60){
        this.endGame();
        //清除interval
        clearInterval(timer);
        return false;
      }else{
        this.totalTime+=1
        if(this.totalTime<10){
          str='00:0'+this.totalTime;
        }else{
          str='00:'+this.totalTime;
        }    
        this.timeLeft.textContent=str;
      }
    },1000);
  }
   
  //開始遊戲
  startGame(){
    //歸零畫面時間
    this.timeLeft.textContent='00:00';
    
    //歸零畫面分數
    this.recordNumber.textContent='000';

    //生出題目
    this.showQuest();
    
  }
  //將使用者的答案送去檢查，並產生新題目
  userInput(e){
    if(e.keyCode == 13){
      this.userAnswer= e.target.value;
      //清除input
      e.target.value='';

      this.checkAnswer();
      this.showQuest();
    }
  }

  //出題目
  showQuest(){
    //運算子
    let operators=[' + ',' - ',' * ',' / ']
    //數字位數: 
    let digits;
    //取得當前秒數
    let now=this.totalTime;
    //依據秒數出題目
    if(now<=20){
      digits=1;
    }else if(now>20 & now<=40){
      digits=2;
    }else{
      digits=3;
    }
    //隨機取得運算子
    let operator=operators[this.question.getRandom(operators.length)];
    let Num1=this.question.getRangeNum(digits);
    let Num2=this.question.getRangeNum(digits);
    //儲存呈現用運算子
    let oper=operator;
    if(operator == ' - '){
      //使被減數大於減數
      if( Num1<Num2){
        let buffer=Num1;
        Num1=Num2;
        Num2=buffer;
      }
    }else if(operator == ' / '){
      oper=' ÷ ';
      Num1=this.question.getNum(digits);  //隨機取得一個合數
      Num2=this.question.getRandomFactor(Num1,digits) //隨機取得此合數的因數
    }else if (operator == ' * '){
      oper =' x ';
    };
    let str=Num1+operator+Num2;
    this.answer =eval(str);
    //組字串並呈現  
    let content=
    `<div class="number">${Num1}</div>
    <div class="questionOperator">${oper}</div>
    <div class="number">${Num2}</div>
    <div class="questionOperator">=</div>`;

    //呈現題目
    document.querySelector('.questionSection').innerHTML=content;
    
  }

  //處理使用者輸入
  checkAnswer(){
    let str;
    //比對答案
    if(this.answer==this.userAnswer){
      if(this.totalTime>0 & this.totalTime<=40){
        this.totalPoint+=1;
      }else if(this.totalTime>40 & this.totalTime<60){
        this.totalPoint+=5;
      }
    }else if(this.totalPoint >0){
      this.totalPoint-=1;
    }else{
      this.totalPoint=0;
    }
    //顯示分數 
    if(this.totalPoint<100){
      str='0'+this.totalPoint;
      if(this.totalPoint<10 ){
        str='00'+this.totalPoint;
      }
  }
  
  this.recordNumber.textContent=str;
  document.querySelector('.finalScore').textContent=this.totalPoint;
  return;
  }
  
  //結束遊戲
  endGame(){
    // 關掉 mainPage
    document.querySelector('.mainPage').classList.add('close');
    // 開啟 scorePage
    document.querySelector('.scorePage').classList.remove('close');
  }

}
//問題產生器
class questionMaker{
  constructor(){
    this.range = (start, stop) => Array.from({ length: (stop - start)}, (_, i) => start + i );
  }

  //random number
  getRandom(x){
    return Math.floor(Math.random()*x);
  };
  //random RANGE number
  getRangeNum(digits){
    let max=Math.pow(10,digits)-1;
    let min=Math.pow(10,digits-1);  
    return Math.floor(Math.random()*(max-min+1))+min
  };

  //判斷是否為質數
  isPrime(num){
    //是2、3、5直接回傳
    if(num==2|num==3|num==5){return true};
    
    if(num%2==0|num%3==0|num%5==0){return false};
    
    for(let i=7;i<=Math.sqrt(num);i++){
      if(num%i ==0){return false}
    }
    return true;
  };

  //提取出一定範圍內的合數
  getNum(digits){
    var vm = this;
    let list=vm.range(Math.pow(10,digits-1),Math.pow(10,digits));
    let Nums = list.filter(function(num){
      return !vm.isPrime(num)
    });
    let num=Nums[vm.getRandom(Nums.length)];  
    return num;
  };

  //取出該數的隨機因數
  getRandomFactor(number,digits){
    let startNum=Math.pow(10,digits-1);
    let factors=[];
    for(let factor=startNum; factor<=number;factor++){
      if(number%factor ==0){
        factors.push(factor);
      }
    }
    return factors[this.getRandom(factors.length)];
  }
}

// DOM
var startPage =document.querySelector('.startPage');
var mainPage =document.querySelector('.mainPage');
var scorePage =document.querySelector('.scorePage');
var startBtn =document.getElementById('start');
var restart =document.getElementById('restart');
var answerInput =document.querySelector('.userInput');

// GAME object
var newGame;

// Event and Listener
startBtn.addEventListener('click',function(e){
  e.preventDefault();
  //關閉 startPage
  startPage.classList.toggle('close'); 
  //開啟 mainPage 
  mainPage.classList.remove('close');
  //start
  newGame=new game();
  newGame.startGame();
  // userInput
  answerInput.addEventListener('keydown',function(e){
    newGame.userInput(e);
  });
});
// restart
restart.addEventListener('click',function(e){
  delete newGame;
  e.preventDefault();
  //關閉 scorePage
  scorePage.classList.remove('close');
  //開啟 mainPage
  mainPage.classList.toggle('close');
  //重啟遊戲
  newGame=new game();
  newGame.startGame()
});



