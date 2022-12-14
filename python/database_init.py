import sqlite3
from sqlite3 import Error
import os

def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file, check_same_thread=False)
    except Error as e:
        print(e)
    return conn

def create_table(conn, create_table_sql):
    try:
        c = conn.cursor()
        c.execute(create_table_sql)
    except Error as e:
        print(e)

def init_tables(conn):
    sql_create_bullet_table = """ CREATE TABLE IF NOT EXISTS bullets (
                                        id integer PRIMARY KEY,
                                        user text,
                                        message text,
                                        video text,
                                        timeline text 
                                    ); """

    create_table(conn, sql_create_bullet_table)
    
def drop_tables(conn):
    c = conn.cursor()
    c.execute("DROP TABLE IF EXISTS bullets")

def create_bullet(conn, bullet):
    sql = ''' INSERT INTO bullets(user,message,video,timeline)
              VALUES(?,?,?,?) '''
    cur = conn.cursor()
    cur.execute(sql, bullet)
    conn.commit()
    return cur.lastrowid
    
def init_sample_bullets(conn):
    bullets = [
        ("testUser1", "This is a sample bullet 1", "prime video 1", "00:00:00"),
        ("testUser2", "This is a sample bullet 2", "prime video 1", "00:00:01"),
        ("testUser3", "This is a sample bullet 3", "prime video 1", "00:00:02"),
        ("testUser1", "This is a sample bullet 4", "prime video 1", "00:00:03"),
        ("testUser2", "This is a sample bullet 5", "prime video 1", "00:00:04"),
        ("testUser3", "This is a sample bullet 6", "prime video 1", "00:00:05"),
        ("testUser1", "This is a sample bullet 7", "prime video 1", "00:01:00"),
        ("testUser2", "This is a sample bullet 8", "prime video 1", "00:01:01"),
        ("testUser3", "This is a sample bullet 9", "prime video 1", "00:01:02"),
        ("testUser1", "This is a sample bullet 10", "prime video 1", "00:01:03"),
        ("testUser2", "This is a sample bullet 11", "prime video 1", "00:01:04"),
        ("testUser3", "This is a sample bullet 12", "prime video 1", "00:01:05")
    ]
    for bullet in bullets:
        create_bullet(conn, bullet)
        

def init_database():
    # Initialize the sqlite database
    working_dir = os.getcwd()
    database = rf"{working_dir}/pv-bullet-chat.db"

    # create a database connection. 
    # If database doesn't exist it will create database as well.
    conn = create_connection(database)
    
    # Drop bullet table.
    drop_tables(conn)
    init_tables(conn)
    init_sample_bullets(conn)
    
    return conn