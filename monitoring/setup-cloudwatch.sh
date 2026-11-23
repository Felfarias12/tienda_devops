#!/bin/bash
set -e
REGION=us-east-1
cd ~/tienda/monitoring

command -v amazon-cloudwatch-agent-ctl >/dev/null 2>&1 || sudo yum install -y amazon-cloudwatch-agent
sudo amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:$PWD/cwagent.json -s

chmod +x push-metrics.sh
( crontab -l 2>/dev/null | grep -v push-metrics ; echo "* * * * * $PWD/push-metrics.sh" ) | crontab -

aws logs put-metric-filter --region $REGION --log-group-name /tienda/backend \
  --filter-name Errores --filter-pattern '{ $.level = "error" || $.statusCode >= 500 }' \
  --metric-transformations metricName=ErroresBackend,metricNamespace=Tienda/App,metricValue=1

aws cloudwatch put-metric-alarm --region $REGION --alarm-name tienda-errores-backend \
  --namespace Tienda/App --metric-name ErroresBackend --statistic Sum --period 300 \
  --evaluation-periods 1 --threshold 5 --comparison-operator GreaterThanOrEqualToThreshold \
  --treat-missing-data notBreaching
aws cloudwatch put-metric-alarm --region $REGION --alarm-name tienda-backend-caido \
  --namespace Tienda/App --metric-name Availability --dimensions Name=Service,Value=backend \
  --statistic Minimum --period 60 --evaluation-periods 3 --threshold 1 \
  --comparison-operator LessThanThreshold --treat-missing-data breaching

aws cloudwatch put-dashboard --region $REGION --dashboard-name Tienda-DevOps \
  --dashboard-body file://cloudwatch-dashboard.json