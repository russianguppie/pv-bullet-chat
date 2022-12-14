

def query_bullet(conn, info):
    cur = conn.cursor()
    cur.execute("SELECT * FROM bullets "
                "WHERE timeline >= ? and timeline <= ? "
                "ORDER BY timeline "
                "LIMIT ?", info)
    rows = cur.fetchall()
    return rows