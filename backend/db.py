import sqlite3


class Db:
    def __init__(self):
        self.conn = None
        self.cursor = None
        self.int()

    def int(self):
        self.conn = sqlite3.connect('yvr_hack.db')
        self.cursor = self.conn.cursor()

        # Create table if it does not exist
        self.cursor.execute('''CREATE TABLE IF NOT EXISTS counts (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                            in_count INTEGER NOT NULL,
                            out_count INTEGER NOT NULL
                        )''')
        self.conn.commit()

    def do_query(self, in_count, out_count):
        self.cursor.execute("INSERT INTO counts (in_count, out_count) VALUES (?, ?)", (in_count, out_count))
        self.conn.commit()
