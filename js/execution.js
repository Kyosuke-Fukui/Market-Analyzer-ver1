//ページ遷移時にグラフ描画
getGraph_S(data_xarray, data_yarray);

//バックテスト処理
$("#backtestbtn").on("click", function () {
  //バリデーション
  if (
    parseInt($("#p1").val()) <= 0 ||
    parseInt($("#p2").val()) <= 0 ||
    $("#risk").val() / 100 < 0 ||
    $("#reward").val() / 100 < 0 ||
    parseInt($("#DMA").val()) < 0
  ) {
    swal("入力された値が不正です。");
  } else if (
    $("#p1").val() == "" ||
    $("#p2").val() == "" ||
    $("#risk").val() == "" ||
    $("#reward").val() == "" ||
    $("#DMA").val() == ""
  ) {
    swal("値を入力してください。");
  } else {
    Plotly.purge("chart");
    getGraph_S(data_xarray, data_yarray);
    plot_PL(data_xarray, data_yarray);
  }
});

//最適化処理
$("#optbtn").on("click", function () {
  var P1 = parseInt($("#opt-p11").val());
  var P2 = parseInt($("#opt-p21").val());
  var dma = parseInt($("#opt-DMA1").val());
  var risk = $("#opt-risk1").val() / 100;
  var reward = $("#opt-reward1").val() / 100;
  var p1_step = parseInt($("#p1-step").val());
  var p2_step = parseInt($("#p2-step").val());
  var DMA_step = parseInt($("#DMA-step").val());
  var risk_step = $("#risk-step").val() / 100;
  var reward_step = $("#reward-step").val() / 100;

  //バリデーション
  if (
    P1 <= 0 ||
    parseInt($("#opt-p12").val()) <= 0 ||
    P1 > parseInt($("#opt-p12").val()) ||
    P2 <= 0 ||
    parseInt($("#opt-p22").val()) <= 0 ||
    P2 > parseInt($("#opt-p22").val()) ||
    dma < 0 ||
    parseInt($("#opt-DMA2").val()) < 0 ||
    dma > parseInt($("#opt-DMA2").val()) ||
    risk < 0 ||
    $("#opt-risk2").val() / 100 < 0 ||
    risk > $("#opt-risk2").val() / 100 ||
    reward < 0 ||
    $("#opt-reward2").val() / 100 < 0 ||
    reward > $("#opt-reward2").val() / 100 ||
    p1_step <= 0 ||
    p2_step <= 0 ||
    DMA_step <= 0 ||
    risk_step <= 0 ||
    reward_step <= 0
  ) {
    swal("入力された値が不正です。");
  } else if (
    $("#opt-p11").val() == "" ||
    $("#opt-p12").val() == "" ||
    $("#opt-p21").val() == "" ||
    $("#opt-p22").val() == "" ||
    $("#opt-DMA1").val() == "" ||
    $("#opt-DMA2").val() == "" ||
    $("#opt-risk1").val() == "" ||
    $("#opt-risk2").val() == "" ||
    $("#opt-reward1").val() == "" ||
    $("#opt-reward2").val() == "" ||
    $("#p1-step").val() == "" ||
    $("#p2-step").val() == "" ||
    $("#DMA-step").val() == "" ||
    $("#risk-step").val() == "" ||
    $("#reward-step").val() == ""
  ) {
    swal("値を入力してください。");
  } else {
    let result = [[], [], [], [], [], [], [], [], [], []];

    //パラメータの全ての組み合わせで計算（計算量がO^nとなるので幅の取り過ぎはフリーズする）
    while (reward <= $("#opt-reward2").val() / 100) {
      while (risk <= $("#opt-risk2").val() / 100) {
        while (P1 <= parseInt($("#opt-p12").val())) {
          while (P2 <= parseInt($("#opt-p22").val())) {
            while (dma <= parseInt($("#opt-DMA2").val())) {
              if (
                P1 < P2 &&
                calcPL(
                  data_xarray,
                  data_yarray,
                  P1,
                  P2,
                  risk,
                  reward,
                  dma
                )[0] !== 0
              ) {
                result[0].push(
                  calcPL(data_xarray, data_yarray, P1, P2, risk, reward, dma)[0] //トレード回数
                );
                result[1].push(
                  calcPL(data_xarray, data_yarray, P1, P2, risk, reward, dma)[9] //勝率
                );
                result[2].push(
                  calcPL(
                    data_xarray,
                    data_yarray,
                    P1,
                    P2,
                    risk,
                    reward,
                    dma
                  )[10] //平均RR
                );
                result[3].push(
                  calcPL(data_xarray, data_yarray, P1, P2, risk, reward, dma)[1] //総損益率（単利）
                );
                result[4].push(
                  calcPL(data_xarray, data_yarray, P1, P2, risk, reward, dma)[2] //平均損益率
                );
              } else {
                result[0].push(null);
                result[1].push(null);
                result[2].push(null);
                result[3].push(null);
                result[4].push(null);
              }

              result[5].push(P1);
              result[6].push(P2);
              result[7].push(risk * 100);
              result[8].push(reward * 100);
              result[9].push(dma);

              dma += DMA_step;
            }
            dma = parseInt($("#opt-DMA1").val()); //DMAを初期値に戻す
            P2 += p2_step;
          }
          P2 = parseInt($("#opt-p21").val()); //p2を初期値に戻す
          P1 += p1_step;
        }
        P1 = parseInt($("#opt-p11").val()); //p1を初期値に戻す
        risk += risk_step;
      }
      risk = $("#opt-risk1").val() / 100; //riskを初期値に戻す
      reward += reward_step;
    }

    //総損益率が最も高い配列要素の添字
    var plmax = result[3].indexOf(Math.max.apply(null, result[3]));

    //総損益率が最も高い
    var tr1 = result[0][plmax]; //トレード回数
    var wr1 = result[1][plmax].toFixed(2); //勝率
    var RR1 = result[2][plmax].toFixed(2); //平均RR
    var pl1 = result[3][plmax].toFixed(2); //総損益率
    var avr1 = result[4][plmax].toFixed(2); //平均損益率
    var p11 = result[5][plmax]; //p1
    var p21 = result[6][plmax]; //p2
    var risk1 = result[7][plmax].toFixed(1); //risk
    var reward1 = result[8][plmax].toFixed(1); //reward
    var DMA1 = result[9][plmax]; //DMA

    //平均損益率が最も高い配列要素の添字
    var avrmax = result[4].indexOf(Math.max.apply(null, result[4]));

    //平均損益率が最も高い
    var tr2 = result[0][avrmax]; //トレード回数
    var wr2 = result[1][avrmax].toFixed(2); //勝率
    var RR2 = result[2][avrmax].toFixed(2); //平均RR
    var pl2 = result[3][avrmax].toFixed(2); //総損益率
    var avr2 = result[4][avrmax].toFixed(2); //平均損益率
    var p12 = result[5][avrmax]; //p1
    var p22 = result[6][avrmax]; //p2
    var risk2 = result[7][avrmax].toFixed(1); //risk
    var reward2 = result[8][avrmax].toFixed(1); //reward
    var DMA2 = result[9][avrmax]; //DMA

    $("#opt-result").html(`（最適化結果）<br><li>最適化対象：総損益率
    <table>
      <tr>
        <td>トレード回数</td>
        <td>勝率</td>
        <td>平均RR</td>
        <td>総損益率</td>
        <td>平均損益率</td>
        <td>短期EMA</td>
        <td>長期EMA</td>
        <td>DMA</td>
        <td>損切</td>
        <td>利確</td>
      </tr>   
      <tr>
        <td>${tr1}回</td>
        <td>${wr1}%</td>
        <td>${RR1}</td>
        <td>${pl1}%</td>
        <td>${avr1}%</td>
        <td>${p11}</td>
        <td>${p21}</td>
        <td>${DMA1}</td>
        <td>${risk1}%</td>
        <td>${reward1}%</td>
      </tr>
    </table>
    </li>
    <li>最適化対象：平均損益率
    <table>
      <tr>
        <td>トレード回数</td>
        <td>勝率</td>
        <td>平均RR</td>
        <td>総損益率</td>
        <td>平均損益率</td>
        <td>短期EMA</td>
        <td>長期EMA</td>
        <td>DMA</td>
        <td>損切</td>
        <td>利確</td>
      </tr>   
      <tr>
        <td>${tr2}回</td>
        <td>${wr2}%</td>
        <td>${RR2}</td>
        <td>${pl2}%</td>
        <td>${avr2}%</td>
        <td>${p12}</td>
        <td>${p22}</td>
        <td>${DMA2}</td>
        <td>${risk2}%</td>
        <td>${reward2}%</td>
      </tr>
    </table>
    </li>`);

    swal("最適化処理完了しました。");
  }
});

//投資戦略の説明
$("#aboutStrategy").on("click", function () {
  swal({
    text:
      "＜短期/長期EMAのゴールデン/デッドクロス戦略＞\n\nEMA（Exponential Moving Average）とは：\n「（指数平滑化）移動平均線」といわれ、価格のトレンドを表すのに用いられます。\n\nゴールデン/デッドクロスとは：\n価格が上昇し、短期の移動平均線が長期の移動平均線を上抜けることを「ゴールデンクロス」といい、今後の値動きが上昇傾向になる可能性が高いため買いタイミングを示すシグナルである、と考えられています。\n反対に、短期の移動平均線が長期の移動平均線を下抜けることを「デッドクロス」といいます。\n\n当戦略は、ゴールデンクロスが発生したタイミングで売りポジションがあれば決済し新規で買いを入れ、デッドクロスが発生したタイミングで買いポジションがあれば決済し新規で売りを入れる戦略です。",
  });
});

//DMAの説明
$("#aboutDMA").on("click", function () {
  swal({
    text:
      "DMA（Displaced Moving Average）とは：\n\nパラメータの値だけ横にずらして（遅らせて）表示した移動平均線。\n本来の移動平均線よりもシグナルの発生を遅らせることができ、いわゆるダマシの回避として有用、と考えられている。\n当ツールではシグナルの位置のみグラフに反映。",
  });
});
