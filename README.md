# Market-Analyzer-ver1
## G's camp 最終成果物

## <データ選択画面>

![image](https://user-images.githubusercontent.com/79554085/112903920-24aafa80-9123-11eb-97d0-324bdc98b0e4.png)


### 上部　マーケットデータ（csvファイル）をDBにアップロード

### 下部　DBからテーブル名、期間を選択してグラフ描画（メイン画面に遷移）

## <メイン画面>
![image](https://user-images.githubusercontent.com/79554085/112904241-9a16cb00-9123-11eb-9fc5-0591711ca1a1.png)

- バックテスト機能
　短期EMA、長期EMA、DMA、損切、利確のパラメータを設定し、表示期間におけるパフォーマンスを計算。売買タイミングをグラフに描画
 
- パラメータ最適化
　表示期間におけるパフォーマンス（総損益率、平均損益率）が最大になるパラメータの値を計算
 
- データ選択
 　メイン画面からデータの再選択可能


## <適用する投資戦略について>

![image](https://user-images.githubusercontent.com/79554085/112905065-c7b04400-9124-11eb-96b7-04cb120ba385.png)

- strategy.jsを書き換えることで様々な投資戦略に適用可能
