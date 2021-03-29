//原データの指数平滑移動平均値を返す関数
function EMACalc(mArray, mRange) {
  var k = 2 / (mRange + 1);
  emaArray = [mArray[0]];
  for (var i = 1; i < mArray.length; i++) {
    emaArray.push(mArray[i] * k + emaArray[i - 1] * (1 - k));
  }
  return emaArray;
}

//ゴールデンクロス・デッドクロスのシグナル配列を返す関数
var GCDC = function (a, b, dma) {
  var a_b = [];
  for (let i = 0; i < a.length; i++) {
    a_b.push(a[i] - b[i]);
  }
  var gcdc = [0];
  for (let j = 1; j < a.length; j++) {
    if (a_b[j - 1] < 0 && a_b[j] >= 0) {
      gcdc.push(1);
    } else if (a_b[j - 1] > 0 && a_b[j] <= 0) {
      gcdc.push(-1);
    } else {
      gcdc.push(0);
    }
  }

  //シグナル発生をDMAパラメータ分だけ遅らせる
  if (dma > 0) {
    for (let k = 1; k < dma + 1; k++) {
      gcdc.unshift(0);
      gcdc.pop();
    }
  }
  return gcdc;
};

//分析対象のデータ群を設定する関数
var getDataSet = function (mArray, p1, p2, dma) {
  var rawdata = mArray;
  var ind1 = EMACalc(rawdata, p1); //ここを変えれば様々なインジケータを利用可能
  var ind2 = EMACalc(rawdata, p2);
  var sigarr = GCDC(ind1, ind2, dma); //ここを変えれば様々な投資戦略を利用可能
  return [rawdata, ind1, ind2, sigarr];
};
