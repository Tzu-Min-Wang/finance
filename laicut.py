#-*- coding: UTF-8 -*-
import pandas as pd
import csv,os,time
path='/Users/wangtzumin/Desktop/lai/'
for file in os.listdir(path):
    e=pd.read_csv(path+file,engine='c')
    df=pd.DataFrame(e)
    print(df['年月'])
