FROM neugcstieacr01.azurecr.io/baseimg/nodejs6_microservices_bionic:v1
ENV HOME_PATH=/usr/reactuiboilerplate

RUN mkdir -p ${HOME_PATH}
WORKDIR ${HOME_PATH}
COPY /build/reactuiboilerplate.zip ${HOME_PATH}

RUN unzip  ${HOME_PATH}/reactuiboilerplate.zip -d ${HOME_PATH}

RUN rm -f ${HOME_PATH}/reactuiboilerplate.zip
