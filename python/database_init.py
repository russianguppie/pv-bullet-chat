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

def create_bullet(conn, bullet):
    sql = ''' INSERT INTO bullets(user,message,video,timeline)
              VALUES(?,?,?,?) '''
    cur = conn.cursor()
    cur.execute(sql, bullet)
    conn.commit()
    return cur.lastrowid
    
def init_sample_bullets(conn):
    bullets = [
        ("testUser1", "This is a sample bullet 1", "prime video 1", "00:00:00")
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
    init_tables(conn)
    init_sample_bullets(conn)
    
    return conn