<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="https://necolas.github.io/normalize.css/8.0.1/normalize.css">
    <link rel="stylesheet" type="text/css" href="css/style1.css?ver=??">
    <title>Market Analyzer</title>
  </head>
  <body>  
    <h1>Market Analyzer</h1>
      <form class="form1" action="upload.php" method="post" enctype="multipart/form-data">
        <fieldset>
          <legend>CSVファイルアップロード</legend>
            <input type="file" name="upfile" accept=".csv"/><br>
            <label>テーブル名：
              <select name="table_name">
                <option value="USDJPY">USDJPY</option>
                <option value="EURUSD">EURUSD</option>
                <option value="GBPUSD">GBPUSD</option>
                <option value="BTCUSD">BTCUSD</option>
              </select>
            </label>
            <input type="submit" value="アップロード" />
        </fieldset>
      </form>  
      <form class="form2" method="post" action="select.php">
        <fieldset>
          <legend>データ選択</legend>
          <label>テーブル名：
            <select name="table_name">
              <option value="USDJPY">USDJPY</option>
              <option value="EURUSD">EURUSD</option>
              <option value="GBPUSD">GBPUSD</option>
              <option value="BTCUSD">BTCUSD</option>
            </select>
          </label>
          <div>
          <label>start：<input class="time" type="datetime-local" name="start_time" value="2020-01-01T07:00:00"></label><br>
          <label>end： <input class="time" type="datetime-local" name="end_time" value="2022-01-01T06:00:00"></label>
          <div>
          <input type="submit" value="グラフ表示">
        </fieldset>
      </form>
  </body>
</html>
