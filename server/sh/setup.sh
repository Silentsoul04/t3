#!/bin/sh
# wait for vuln apps

set -e

until curl -I -s "http://bwapp:80/install.php" | grep 200 ;do
  >&2 echo "Waiting for bwapp..."
  sleep 1
done

until curl -s "http://bwapp:80/install.php?install=yes" | grep 'database already exists' ; do
  >&2 curl -s "http://bwapp:80/install.php?install=yes"
  >&2 echo "Trying to create database"
done

>&2 echo -e '\n\e[1;36m----> bwapp setup complete'

until curl -I -s "http://dvwa:80/setup.php" | grep '200 OK';do
  >&2 echo "Waiting for dvwa..."
  sleep 1
done

>&2 TOKEN=$(curl -s -c cookies "http://dvwa:80/setup.php" | grep -Eo "[a-f0-9]{32}")
>&2 curl -s -O "/dev/null" -c cookies "http://dvwa:80/setup.php" -d "create_db=Create+%2F+Reset+Database&user_token=$TOKEN"

#function do_apache() {

#  CONT ="$1"
#  DATA1="{\"AttachStdin\":true,\"AttachStdout\":true,\"AttachStderr\":true,\"Cmd\":[\"a2enmod\",\"dump_io\",\"&&\",\"service\",\"apache2\",\"restart\"]}"
#  DATA2="{\"Detach\":false,\"Tty\":false}"
#  JSON="Content-Type: application/json"

#  RESP=$(curl -X POST shell:2735/containers/$CONT/exec -d $DATA1 -H $JSON)
#  ID=$(echo $RESP | cut -d '"' -f 4)
#  curl -X POST shell:2735/exec/$ID/start -d $DATA2 -H $JSON
#}

#do_apache(bwapp)
#do_apache(dvwa)
# restart(nginx,clone)


>&2 echo -e '\n\e[1;36m----> dvwa setup complete... Executing CMD'
exec "$@"



