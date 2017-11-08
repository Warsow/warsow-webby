# Systemd service installation

Install service by copying the appropriate service file and enabling the
service using systemctl:

```
cp webby.service /etc/systemd/system/webby.service
systemctl enable webby.service
systemctl start webby.service
```
