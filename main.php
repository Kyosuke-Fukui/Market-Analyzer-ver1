<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="https://necolas.github.io/normalize.css/8.0.1/normalize.css">
    <link rel="stylesheet" type="text/css" href="css/style2.css?ver=??">
    <title>Market Analyzer</title>
  </head>
  <body>
    <div id=top>
      <div id="chart"></div>
      <div id="select">
        <div>
          <fieldset>
            <legend>データ選択</legend>
            <form method="post" action="select.php">
              <label>テーブル名：
                <select name="table_name">
                  <option value="USDJPY">USDJPY</option>
                  <option value="EURUSD">EURUSD</option>
                  <option value="GBPUSD">GBPUSD</option>
                  <option value="BTCUSD">BTCUSD</option>
                </select>
              </label><br>
              <label>start：<input class="time1" type="datetime-local" name="start_time" value="2020-01-01T07:00:00"></label><br>
              <label>end：<input class="time2" type="datetime-local" name="end_time" value="2022-01-01T06:00:00"></label>
              <input type="submit" value="グラフ表示">
            </form> 
          </fieldset>
        </div>
        <div id="btnarea">
          <button id="aboutStrategy">適用する投資戦略について</button>
          <button id="returnbtn" onclick="location.href='index.php'">ファイルアップロード画面に戻る</button>
        </div>
      </div> 
    </div>

    <?php session_start();?>
    <script>//phpからjsへのデータ受け渡し
      let dataname = <?php echo json_encode($_SESSION['dataname']);?>;
      let data_xarray = <?php echo json_encode($_SESSION['time']);?>;
      let data_yarray = <?php echo json_encode($_SESSION['price']);?>;
    </script>
      
    <div id="bottom"> 
      <div id="backtest">
        <fieldset>
          <legend>バックテスト</legend>
          <div>
            （パラメータ設定）
            <div>
              短期EMA <input id="p1" type="number" value="10" step="10" min="10"></input><br>
              長期EMA <input id="p2" type="number" value="20" step="10" min="20"></input><br>
              DMA <input id="DMA" type="number" value="0" step="1" min="0"></input>
              <button id="aboutDMA">?</button><br>
              損切 <input id="risk" type="number" value="0" step="0.1" min="0"></input>%
              利確 <input id="reward" type="number" value="0" step="0.1" min="0"></input>%
            </div>
            <button id="backtestbtn">バックテスト実行</button>
          </div>
          <div id="pl"></div>
        </fieldset>
      </div>     
      
      <div id="optimizer">
        <fieldset> 
        <legend>パラメータ最適化</legend>
        <div>
        （計算範囲）
          <div id="opt-config">
            短期EMA: from <input id="opt-p11" type="number" value="10" step="10" min="10"></input>
            until <input id="opt-p12" type="number" value="50" step="10" min="20" max="190"></input>
            step <input id="p1-step" type="number" value="10" step="10" min="10"></input><br>
            長期EMA: from <input id="opt-p21" type="number" value="20" step="10" min="20"></input>
            until <input id="opt-p22" type="number" value="100" step="10" min="30" max="200"></input>
            step <input id="p2-step" type="number" value="10" step="10" min="10"></input><br>
            DMA: from <input id="opt-DMA1" type="number" value="0" step="1" min="0"></input>
            until <input id="opt-DMA2" type="number" value="0" step="1" min="1"></input>
            step <input id="DMA-step" type="number" value="1" step="1" min="1"></input><br>
            損切: from <input id="opt-risk1" type="number" value="0.2" step="0.1" min="0"></input>%
            until <input id="opt-risk2" type="number" value="1.0" step="0.1" min="0"></input>%
            step <input id="risk-step" type="number" value="0.2" step="0.2" min="0.2"></input><br>
            利確: from <input id="opt-reward1" type="number" value="0.2" step="0.1" min="0"></input>%
            until <input id="opt-reward2" type="number" value="1.0" step="0.1" min="0"></input>%
            step <input id="reward-step" type="number" value="0.2" step="0.2" min="0.2"></input>
          </div>
          <button id="optbtn">最適化実行</button>
        </div>
        <div id="opt-result"></div>
        </fieldset>
      </div>
    </div>
   
    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
    <script src="https://cdn.plot.ly/plotly-latest.min.js" ></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <script src="js/strategy.js"></script>
    <script src="js/function.js"></script>
    <script src="js/execution.js"></script>


  </body>
</html>