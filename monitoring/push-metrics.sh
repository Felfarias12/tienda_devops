#!/bin/bash
# Publica disponibilidad y consumo por contenedor en CloudWatch.
# Lo ejecuta cron cada minuto en la EC2 (ver setup-cloudwatch.sh).
export PATH="$PATH:/usr/local/bin:/snap/bin"
REGION=us-east-1
NS="Tienda/App"

put() {
  aws cloudwatch put-metric-data --region "$REGION" --namespace "$NS" \
    --metric-name "$1" --dimensions Service="$2" --value "$3" --unit "$4"
}

check() {
  curl -fsS -m 5 "$2" >/dev/null 2>&1 && v=1 || v=0
  put Availability "$1" "$v" Count
}

check backend  http://localhost:3001/api/health
check frontend http://localhost:80

docker stats --no-stream --format '{{.Name}} {{.CPUPerc}} {{.MemPerc}}' | while read -r n c m; do
  put ContainerCPU    "$n" "${c%\%}" Percent
  put ContainerMemory "$n" "${m%\%}" Percent
done