# 接口文档

```
    ip_normal 是逻辑服务器
    ip_sql 是数据库服务器
```

## 目录：
[1.登录](#1登录接口)<br/>
[2.获取验证码](#2获取验证码)<br/>

## 接口列表：
### 1.登录接口
#### 请求方法和URL:
```
POST
http://ip_normal/login/
```
#### 参数：
|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
|login_type|true|uint|选择登录方式
|phone_number|false|string|
|password|false|string|
|verification_code|false|string|
|session_id|false|string|
|phone_mac|false|string|

#### 说明
1. login_type = 101
    >普通登录模式，必选参数：phone_number,password,phone_mac
2. login_type = 102
    >普通注册模式，必选参数：phone_number,password,verification_code
3. login_type = 103
    >会话登录模式，必选参数：phone_number,session_id,phone_mac

#### 返回示例：
```
{

}
```

### 2.获取验证码：
#### 请求方法和URL：
```
GET
http://ip_normal/verification_code/:phone_number
```
#### 参数：
|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|


#### 说明

#### 返回示例：
```
{

}
```




### n.名称
#### 请求方法和URL:
```
```
#### 参数：
|参数|是否必选|类型|说明|
|:-----|:-------:|:-----|:-----|
#### 说明
1.
#### 返回示例：
```
```