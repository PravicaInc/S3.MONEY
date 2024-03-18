package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	db "github.com/pravicainc/s3.money/backend/apiserver/dynamodb"

	h "github.com/gorilla/handlers"

	"github.com/aws/aws-lambda-go/lambda"
	"github.com/awslabs/aws-lambda-go-api-proxy/httpadapter"
)

const (
	PORT    = 5000                    // used to run local server for testing
)

var (
	runningLocally = false
)

func init() {
	runtime_api, _ := os.LookupEnv("AWS_LAMBDA_RUNTIME_API")
	runningLocally = (runtime_api == "")
}

/* Endpoints:
   - /login: takes a sui address, returns a token and writes it dynamodb
   - /create: takes a json object, sends it to sqs and dynamodb, returns a dynamodb key
   - /events/<dynamodb-key>: returns the current state of the data
   - /contract/<address>-<packageName>: the module + deps needed to publish the package
*/

// Ret: response message.  FIXME - name
type Ret struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

// Login req + resp

// LoginReq is what the frontend ends us: a SUI address
type LoginReq struct {
	Address string `json:"address"`
}

// LoginResp is what we return to the frontend: either status=okay and a
// token, or status=error and error=the-error-message
type LoginResp struct {
	Status string `json:"status"`
	Token  string `json:"token,omitempty"`
	ErrMsg string `json:"error,omitempty"`
}

func loginError(msg string) (b []byte) {
	resp := LoginResp{
		Status: "error",
		ErrMsg: msg,
	}
	b, _ = json.Marshal(resp)

	return
}

// Create req + resp

// CreateReq is what the frontend sends us to customize and create a stablecoin package
type CreateReq struct {
	Address     string `json:"address"`
	PackageName string `json:"packageName"`
	Ticker      string `json:"ticker"`
	Name        string `json:"name"`
	Decimals    uint8  `json:"decimals"`
}

// CreateResp is what we return: either status=okay and eventKey=something in dynamodb, or status=error and error=the-error-message
type CreateResp struct {
	Status   string `json:"status"`
	EventKey string `json:"eventKey,omitempty"`
	ErrMsg   string `json:"error,omitempty"`
}

func createError(msg string) (b []byte) {
	resp := CreateResp{
		Status: "error",
		ErrMsg: msg,
	}
	b, _ = json.Marshal(resp)

	return
}

// Event resp.  request is a GET

// EventResp is what we return: status=error and error=the-error-message, or status=okay and state is one of "enqueued", "processing", "created", or "failed".  if status=created, message is /contract/address-packageName (see below)
type EventResp struct {
	Status  string `json:"status"`
	State   string `json:"state,omitempty"`
	Message string `json:"message,omitempty"`
	ErrMsg  string `json:"error,omitempty"`
}

func eventError(msg string) (b []byte) {
	resp := EventResp{
		Status: "error",
		ErrMsg: msg,
	}
	b, _ = json.Marshal(resp)

	return
}

// Contract resp.  request is a GET
// ContractResp is what we return: status=error and error=the-error-message, or status=okay and the module and dependencies fields have data
type ContractResp struct {
	Status       string `json:"status"`
	Module       string `json:"module,omitempty"`
	Dependencies string `json:"dependencies,omitempty"`
	ErrMsg       string `json:"error,omitempty"`
}

func contractError(msg string) (b []byte) {
	resp := ContractResp{
		Status: "error",
		ErrMsg: msg,
	}
	b, _ = json.Marshal(resp)

	return
}

func router() *http.ServeMux {
	mux := http.NewServeMux()

	// poc api -- /api/v0
	mux.HandleFunc("POST /api/v0/login", loginV0)
	mux.HandleFunc("POST /api/v0/create", createV0)
	mux.HandleFunc("GET /api/v0/event/{id}", eventV0)
	mux.HandleFunc("GET /api/v0/contract/{id}", contractV0)

	// misc
	mux.HandleFunc("GET /env", envHandler)
	mux.HandleFunc("/", defaultHandler)

	return mux
}

func loginV0(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var (
		err  error
		lreq LoginReq
	)

	defer req.Body.Close()
	body, err := io.ReadAll(req.Body)
	if err != nil {
		w.Write(loginError(err.Error()))
		return
	}
	err = json.Unmarshal(body, &lreq)
	if err != nil {
		w.Write(loginError(err.Error()))
		return
	}

	token := db.CreateAndSaveToken(lreq.Address)

	lresp := LoginResp{
		Status: "okay",
		Token:  token,
	}
	if b, err := json.Marshal(lresp); err != nil {
		w.Write(loginError(err.Error()))
		return
	} else {
		w.Write(b)
	}
}

func createToken(address string) string {
	return "token"
}

func createV0(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var (
		err  error
		creq CreateReq
	)

	defer req.Body.Close()
	body, err := io.ReadAll(req.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(createError(err.Error()))
		return
	}
	err = json.Unmarshal(body, &creq)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write(createError(err.Error()))
		return
	}
}

func eventV0(w http.ResponseWriter, req *http.Request) {
	_ = req.PathValue("id")

	w.Header().Set("Content-Type", "application/json")
}

func contractV0(w http.ResponseWriter, req *http.Request) {
	_ = req.PathValue("id")

	w.Header().Set("Content-Type", "application/json")
}

func envHandler(w http.ResponseWriter, req *http.Request) {
	if b, err := json.Marshal(os.Environ()); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		io.WriteString(w, `{"status": "error", "message": "something went wrong"}`)
	} else {
		ret := Ret{
			Status:  "okay",
			Message: string(b),
		}
		if b, err := json.Marshal(ret); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
		} else {
			w.Write(b)
		}
	}
}

func defaultHandler(w http.ResponseWriter, req *http.Request) {
	if req.URL.Path != "/" {
		http.NotFound(w, req)
		return
	}

	ret := Ret{
		Status:  "okay",
		Message: req.URL.Path,
	}

	if b, err := json.Marshal(ret); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.Write(b)
	}
}

func main() {
	db.SetLocal(runningLocally)

	if runningLocally {
		db.CreateTables()
		log.Printf("starting local server, port %d", PORT)
		wrapped := h.CombinedLoggingHandler(os.Stdout,
			h.CompressHandler(h.ContentTypeHandler(router(), "application/json")))
		log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", PORT), wrapped))
	} else {
		lambda.Start(httpadapter.New(router()).ProxyWithContext)
	}
}

// eof
