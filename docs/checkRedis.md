ps aux | grep redis

brew services list

redis-cli ping

kill -9 9034

sudo nano /opt/homebrew/etc/redis.conf
redis-cli -p 6381 ping

# Terminal Commands
redis-server /opt/homebrew/etc/redis.dev --daemonize yes
brew services start redis
