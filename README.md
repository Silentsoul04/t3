# t3

Triage Tactics Trainer 

- Docker simplifies process of deploying application in a consistent, isolated environment

## Setup

```bash
# Clone repo
git clone https://github.com/atstpls/t3.git
cd t3

# Clone website
./clone.sh <website>
```

## Operation

```bash
# Build and run
cd t3
docker-compose build
docker-compose up -d

# Stop containers 
docker-compose stop

# Stop containers and delete volumes used 
docker-compose stop --volumes 
```

## Custom Configs 

Splunk field extractions can be added to `shared-data/admin/search/local/props.conf`

## References 

- [Caldera](https://github.com/mitre/caldera.git)
- [Megatutorial](https://github.com/miguelgrinberg/microblog)
