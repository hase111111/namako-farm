# namako-farm
Web系の知識のキャッチアップのためのGaaS制作プロジェクト。


### Dockerのインストール方法

https://qiita.com/haveAbook/items/0d0ae20a19214f65e7cd

### Docker Composeの使い方

`docker compose` コマンドは、複数のコンテナをまとめて管理するためのツール

| コマンド | 説明 |
| :--- | :--- |
| `docker compose up -d` | `docker-compose.yml` の設定に基づいてコンテナを**バックグラウンド（`-d`）で起動**する。イメージがない場合は自動でダウンロードされる|
| `docker compose ps` | 現在動いているコンテナの**状態（ステータス）を一覧表示**する。ポート番号や起動時間を確認するのに利用する。 |
| `docker compose down` | 起動しているコンテナを**停止**する。`volumes` で指定したデータは保持される。 |
| `docker compose stop` | コンテナを**一時停止**する。再度 `up` するか `start` すると再開できる。 |
| `docker compose start` | `stop` で一時停止したコンテナを**再起動**する。 |

### 備忘録

Pythonの仮想環境立ち上げは`python -m venv venv` で作成し、`source venv/bin/activate` で有効化、`deactivate` で無効化する。
仮想環境下でinstallしたのち、`pip freeze > requirements.txt`で書きだせる。

VSCode拡張のWSLの調子が悪い時は履歴を消せばだいたい解決する。`rm -rf ~/.vscode-server/`
