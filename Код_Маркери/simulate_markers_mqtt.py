import sys
from paho.mqtt import client as mqtt_client
import time
import json

# Broker
broker = "broker.hivemq.com"
port = 1883

# Topic
topic = "cupcarbon/marker"

print("getid", flush=True)
id = input()
client_id = "cupcarbon" + id

import random

def random_between(min_val, max_val):
    return random.uniform(min_val, max_val)


def connect_mqtt():
    def on_connect(client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!", flush=True)
        else:
            print("Failed to connect, return code ", rc, flush=True)

    # Set Connecting Client ID
    client = mqtt_client.Client(client_id)
    # client.username_pw_set(username, password)
    client.on_connect = on_connect
    client.connect(broker, port)
    return client


def publish_data(client,t,r,w,i):
    data = {
        "type":0,
        "trail-id": 1,
        "marker-id":id,
        "rainfall": r,
        "windspeed": w,
        "impulses": i,
        "temperature": t,
        "sensor-id": 1
    }
    json_data = json.dumps(data)
    client.publish(topic, json_data)
    print("Published:", json_data, flush=True)

def publish_tourists(client,d,num):
    data = {
        "type":5,
        "trail-id": 1,
        "marker-id":id,
        "direction": d,
        "number": num,
        "sensor-id": 1
    }
    json_data = json.dumps(data)
    client.publish(topic, json_data)
    print("Published:", json_data, flush=True)

def publish_all_data(client,t,r,w,i,wd,hum,press,cl):
    data = {
        "type": 9,
        "trail-id": 1,
        "marker-id":id,
        "rainfall": r,
        "windspeed": w,
        "impulses": i,
        "temperature": t,
	"windirection": wd,
	"humidity": hum,
	"pressure": press,
	"cloudiness": cl,
        "sensor-id": 1
    }
    json_data = json.dumps(data)
    client.publish(topic, json_data)
    print("Published:", json_data, flush=True)

def publish_warn(client,k,t,v):
    data = {
        "type":k,
        "trail-id": 1,
        "marker-id":id,
        "temp": t,
        "value": v,
        "sensor-id": 1
    }
    json_data = json.dumps(data)
    client.publish(topic, json_data)
    print("Published:", json_data, flush=True)

import datetime





def run():
    client = connect_mqtt()
    client.loop_start()
    start_time = datetime.datetime.now()
    start_tourists = datetime.datetime.now()
    k = 0
    temp = 0
    rain = 0
    wind = 0
    imp = 0
    wd = 0   
    hum = 0
    cl = 0
    pres = 0
    t0 = 0
    t01 = 0
    r0 = 0
    w0 = 0
    w01 = 0
    i0 = 0
    button = 0
    b = 0
    tour = 0

    temp = random_between(-30, 35)
    rain = random_between(0, 10)
    wind = random_between(0, 80)
    imp = random_between(0, 10)
    if id=="3" or id=="5":
        wd = random_between(0, 360)
        pres = random_between(0, 1500)
        hum = random_between(0, 100)
        cl = random_between(0, 10)
    if id=="3" or id=="5":
        publish_all_data(client,temp,rain,wind,imp, wd, hum, pres, cl)
    else:
        publish_data(client,temp,rain,wind,imp)
    time.sleep(60)
    temp = random_between(-30, 35)
    rain = random_between(0, 10)
    wind = random_between(0, 80)
    imp = random_between(0, 10)
    if id=="3" or id=="5":
        wd = random_between(0, 360)
        pres = random_between(0, 1500)
        hum = random_between(0, 100)
        cl = random_between(0, 10)
    if id=="3" or id=="5":
        publish_all_data(client,temp,rain,wind,imp, wd, hum, pres, cl)
    else:
        publish_data(client,temp,rain,wind,imp)

    while True:
        temp = random_between(-30, 35)
        rain = random_between(0, 10)
        wind = random_between(0, 80)
        imp = random_between(0, 10)
        if id=="3" or id=="5":
           wd = random_between(0, 360)
           pres = random_between(0, 1500)
           hum = random_between(0, 100)
           cl = random_between(0, 10)
       
        end_time = datetime.datetime.now()
        differ = end_time - start_time
        if differ.seconds >= 3600:
           if id=="3" or id=="5":
              publish_all_data(client,temp,rain,wind,imp, wd, hum, pres, cl)
           else:
                publish_data(client,temp,rain,wind,imp)
           start_time = datetime.datetime.now()
        
        print("ismarked", flush=True)
        button = input()
        if button == "1":
           print("print Button is pressed", flush=True)
           if b!=1:
              b = 1
              publish_warn(client,6,1,1)
              print("print Data is sent", flush=True)
           else:
              b = 0
              print("unmark", flush=True)
              print("print Button is unmarked", flush=True)

        end_time = datetime.datetime.now()
        differ = end_time - start_tourists
        if differ.seconds >= 300:
           is_tour = random.randint(0, 1)
           if is_tour == 1:
              direct_tour = random.randint(0, 1)
              num = random.randint(0, 10)
              publish_tourists(client,direct_tour,num)
              is_tour = 0
           start_tourists = datetime.datetime.now()
        

        if temp > 35 or temp < -25 :
           if t01!=1:
              t01 = 1 
              publish_warn(client,1,t01,temp)

        elif temp >= 27 or temp <= -15 :
              if t01 == 1 :
                 t0 = 1
                 t01 = 0
                 publish_warn(client,1,t01,temp)
              elif t0!=1 :
                    t0 = 1
                    publish_warn(client,1,t0,temp)
          
        elif t0 == 1 or t01 == 1 :
              t0 = 0
              t01 = 0
              publish_warn(client,1,t0,temp)

        if wind >= 75:
           if w01!=1:
              w01 = 1 
              publish_warn(client,3,w01,wind)
           
        elif wind >= 39 :
           if w01==1 :
              w0 = 1
              w01 = 0
              publish_warn(client,3,w01,wind)
           elif w0!=1 :
              w0 = 1
              publish_warn(client,3,w0,wind)
           
        elif w0 == 1 or w01 == 1 :
              w0 = 0
              w01 = 0
              publish_warn(client,3,w0,wind)
           
        

        if rain >= 1 :
           if r0!=1:
              r0 = 1 
              publish_warn(client,2,r0,rain)
          
        else : 
           if r0 == 1 :
              r0 = 0
              publish_warn(client,2,r0,rain)
           
        
        if imp >= 5 :
           if i0!=1 :
              i0 = 1 
              publish_warn(client,4,i0,imp)

        else : 
           if i0 == 1 :
              i0 = 0
              publish_warn(client,4,i0,imp)
           
        
        time.sleep(30)



if __name__ == '__main__':
    run()
