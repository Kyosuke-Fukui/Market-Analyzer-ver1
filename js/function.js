//損益計算
var calcPL = function (xArray, yArray, p1, p2, risk, reward, dma) {
  var sigarr = getDataSet(yArray, p1, p2, dma)[3];
  var PL_tan = 0; //損益率
  var PL_fuku = 1; //損益率（幾何平均）
  var trade = 0; //トレード回数
  var Buy_Price = 0; //買値
  var Sell_Price = 0; //売値
  var posiflg = 0; //ポジション状態（0:ノーポジ、1:買い玉あり、-1:売り玉あり）
  var win = 0; //勝ちトレード数
  var lose = 0; //負けトレード数
  var profit = 0; //利幅
  var loss = 0; //損失幅

  //グラフに表示するために設定
  var buyArr = [[], []];
  var sellArr = [[], []];
  var slArr = [[], []];
  var tpArr = [[], []];

  for (let i = 0; i < yArray.length; i++) {
    //買いシグナル点灯時
    if (sigarr[i] === 1) {
      //売りポジションがあれば決済
      if (posiflg == -1) {
        PL_tan += (Sell_Price - yArray[i]) / Math.abs(Sell_Price); //売り玉の損益確定
        PL_fuku *= Sell_Price / yArray[i];
        trade += 1; //決済時にトレードカウント
        if (Sell_Price - yArray[i] > 0) {
          win += 1;
          profit += Sell_Price - yArray[i];
        } else {
          lose += 1;
          loss += Math.abs(Sell_Price - yArray[i]);
        }
      }
      Buy_Price = yArray[i]; //新規買い建て
      buyArr[0].push(xArray[i]); //買い建てのタイミングを配列に記録
      buyArr[1].push(Buy_Price);
      posiflg = 1;
      //売りシグナル点灯時
    } else if (sigarr[i] === -1) {
      //買いポジションがあれば決済
      if (posiflg == 1) {
        PL_tan += (yArray[i] - Buy_Price) / Math.abs(Buy_Price); //買い玉の損益確定
        PL_fuku *= yArray[i] / Buy_Price;
        trade += 1;
        if (yArray[i] - Buy_Price > 0) {
          win += 1;
          profit += yArray[i] - Buy_Price;
        } else {
          lose += 1;
          loss += Math.abs(yArray[i] - Buy_Price);
        }
      }
      Sell_Price = yArray[i]; //新規売り建て
      sellArr[0].push(xArray[i]); //売り建てのタイミングを配列に記録
      sellArr[1].push(Sell_Price);
      posiflg = -1;
    } else {
      //買い建て中のとき
      if (posiflg === 1) {
        //損切判定処理
        if (risk > 0) {
          if (yArray[i] < Buy_Price * (1 - risk)) {
            PL_tan += (yArray[i] - Buy_Price) / Math.abs(Buy_Price); //買い玉の損益確定
            PL_fuku *= yArray[i] / Buy_Price;
            trade += 1;
            posiflg = 0;
            slArr[0].push(xArray[i]); //損切のタイミングを配列に記録
            slArr[1].push(yArray[i]);
            lose += 1;
            loss += Math.abs(yArray[i] - Buy_Price);
          }
        }
        //利確判定処理
        if (reward > 0) {
          if (yArray[i] > Buy_Price * (1 + reward)) {
            PL_tan += (yArray[i] - Buy_Price) / Math.abs(Buy_Price); //買い玉の損益確定
            PL_fuku *= yArray[i] / Buy_Price;
            trade += 1;
            posiflg = 0;
            tpArr[0].push(xArray[i]); //利確のタイミングを配列に記録
            tpArr[1].push(yArray[i]);
            win += 1;
            profit += yArray[i] - Buy_Price;
          }
        }
      }

      //売り建て中のとき
      if (posiflg === -1) {
        //損切判定処理
        if (risk > 0) {
          if (yArray[i] > Sell_Price * (1 + risk)) {
            PL_tan += (Sell_Price - yArray[i]) / Math.abs(Sell_Price); //売り玉の損益確定
            PL_fuku *= Sell_Price / yArray[i];
            trade += 1;
            posiflg = 0;
            slArr[0].push(xArray[i]); //損切のタイミングを配列に記録
            slArr[1].push(yArray[i]);
            lose += 1;
            loss += Math.abs(Sell_Price - yArray[i]);
          }
        }
        //利確判定処理
        if (reward > 0) {
          if (yArray[i] < Sell_Price * (1 - reward)) {
            PL_tan += (Sell_Price - yArray[i]) / Math.abs(Sell_Price); //売り玉の損益確定
            PL_fuku *= Sell_Price / yArray[i];
            trade += 1;
            posiflg = 0;
            tpArr[0].push(xArray[i]); //利確のタイミングを配列に記録
            tpArr[1].push(yArray[i]);
            win += 1;
            profit += Sell_Price - yArray[i];
          }
        }
      }
    }
  }

  return [
    trade, //トレード回数
    PL_tan * 100, //総損益率（単利）
    (PL_tan / trade) * 100, //平均損益率（算術平均）
    (PL_fuku - 1) * 100, //総損益率（複利）
    (PL_fuku ** (1 / trade) - 1) * 100, //平均損益率（幾何平均）
    buyArr,
    sellArr,
    slArr,
    tpArr,
    (win / trade) * 100, //勝率
    profit / win / (loss / lose), //リスクリワード比（平均利幅と平均損失幅の比）
  ];
};

//検証結果出力
async function plot_PL(xArray, yArray) {
  var p1 = parseInt($("#p1").val());
  var p2 = parseInt($("#p2").val());
  var risk = $("#risk").val() / 100;
  var reward = $("#reward").val() / 100;
  var dma = parseInt($("#DMA").val());
  var TR = calcPL(xArray, yArray, p1, p2, risk, reward, dma)[0];
  var PL_tan = calcPL(xArray, yArray, p1, p2, risk, reward, dma)[1].toFixed(2);
  var AVR_tan = calcPL(xArray, yArray, p1, p2, risk, reward, dma)[2].toFixed(2);
  var PL_fuku = calcPL(xArray, yArray, p1, p2, risk, reward, dma)[3].toFixed(2);
  var winrate = calcPL(xArray, yArray, p1, p2, risk, reward, dma)[9].toFixed(2);
  var RR = calcPL(xArray, yArray, p1, p2, risk, reward, dma)[10].toFixed(2);

  $("#pl").html(`（バックテスト結果）<br><li>トレード回数：${TR}回</li>
  <li>勝率：${winrate}%　平均RR：${RR}
  </li>
  <li>総損益率
    <table>
      <tr>
        <td>単利</td>
        <td>再投資利回り</td>
      </tr>   
      <tr>
        <td>${PL_tan}%</td>
        <td>${PL_fuku}%</td>
      </tr>
    </table>
  </li>
  <li>1トレードの平均損益率：${AVR_tan}%
  </li>
  `);

  var buyArr = calcPL(xArray, yArray, p1, p2, risk, reward, dma)[5];
  var sellArr = calcPL(xArray, yArray, p1, p2, risk, reward, dma)[6];
  var slArr = calcPL(xArray, yArray, p1, p2, risk, reward, dma)[7];
  var tpArr = calcPL(xArray, yArray, p1, p2, risk, reward, dma)[8];

  //売買のタイミングをグラフに描画
  await Plotly.plot("chart", [
    {
      x: buyArr[0],
      y: buyArr[1],
      name: "buy",
      mode: "markers",
      type: "scatter",
      line: {
        color: "red",
      },
    },
    {
      x: sellArr[0],
      y: sellArr[1],
      name: "sell",
      mode: "markers",
      type: "scatter",
      line: {
        color: "blue",
      },
    },
    {
      x: slArr[0],
      y: slArr[1],
      name: "stop loss",
      mode: "markers",
      type: "scatter",
      line: {
        color: "orange",
      },
    },
    {
      x: tpArr[0],
      y: tpArr[1],
      name: "take profit",
      mode: "markers",
      type: "scatter",
      line: {
        color: "green",
      },
    },
  ]);
}

//静止グラフ作成
async function getGraph_S(xArray, yArray) {
  var p1 = parseInt($("#p1").val());
  var p2 = parseInt($("#p2").val());
  var dma = 0; //グラフにdmaの値は影響しない

  var dataArrs = getDataSet(yArray, p1, p2, dma);

  var d1 = dataArrs[0];
  var d2 = dataArrs[1];
  var d3 = dataArrs[2];
  var n1 = dataname;
  var n2 = `EMA(${p1})`;
  var n3 = `EMA(${p2})`;

  //期間選択の値を入力
  $(".time1").val(`${xArray[0].slice(0, 10)}T${xArray[0].slice(11)}`);
  $(".time2").val(
    `${xArray[xArray.length - 1].slice(0, 10)}T${xArray[
      xArray.length - 1
    ].slice(11)}`
  );

  var layout = {
    autosize: false,
    width: 1050,
    height: 400,
    margin: {
      l: 40,
      r: 10,
      b: 60,
      t: 60,
    },
    title: {
      text: `${n1}`,
      font: {
        size: 24,
      },
    },
    xaxis: {
      title: `start :${xArray[0]} －  end :${xArray[xArray.length - 1]}`,
    },
  };
  await Plotly.plot(
    "chart",
    [
      { x: xArray, y: d1, name: n1, line: { width: 1, color: "black" } },
      { x: xArray, y: d2, name: n2, line: { width: 1, color: "blue" } },
      { x: xArray, y: d3, name: n3, line: { width: 1, color: "red" } },
    ],
    layout
  );
}
