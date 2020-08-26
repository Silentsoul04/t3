#!/bin/sh


printf "\e[0;36m_______________________________________________________ |         t3\e[0m
                                                        \e[0;36m|         t3\e[0m
                                                        \e[0;36m|         t3\e[0m
                   Welcome to t3                        \e[0;36m|         t3\e[0m
                                                        \e[0;36m|         t3\e[0m
                                                        \e[0;36m|         t3\e[0m
           Waiting for Splunk to come up....            \e[0;36m|         t3\e[0m
                                                        \e[0;36m|         t3\e[0m
                                                        \e[0;36m|         t3\e[0m
\e[0;36m_______________________________________________________ |         t3\e[0m
"
while ! nc -z splunk 8088;
do
  sleep 1;
done;

printf "                                                        \e[0;36m|         t3\e[0m
                      Ready!                            \e[0;36m|         t3\e[0m
                                                        \e[0;36m|         t3\e[0m
                Visit t3 console at:                    \e[0;36m|         t3\e[0m
                                                        \e[0;36m|         t3\e[0m
                                                        \e[0;36m|         t3\e[0m
               \e[1;33mhttp://localhost:2222                    \e[0;36m|         t3\e[0m
                                                        \e[0;36m|         t3\e[0m
                                                        \e[0;36m|         t3\e[0m
\e[0;36m_______________________________________________________ |         t3\e[0m
"
