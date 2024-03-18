package dynamodb

import (
	"context"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

const (
	LOCAL_DB = "http://localhost:8000" // dynamodb-local endpoint
	TOKEN_TABLE    = "AppTokens"
	STATUS_TABLE   = "PackageStatus"
	DEPLOYED_TABLE = "DeployedContracts"
)

var (
	isRunningLocally = false
	waitTimeout                             = time.Minute * 5
	throughput  types.ProvisionedThroughput = types.ProvisionedThroughput{
		ReadCapacityUnits:  aws.Int64(10),
		WriteCapacityUnits: aws.Int64(10),
	}
	tokensTable dynamodb.CreateTableInput = dynamodb.CreateTableInput{
		AttributeDefinitions: []types.AttributeDefinition{
			{
				AttributeName: aws.String("app_token"),
				AttributeType: types.ScalarAttributeTypeS,
			}, {
				AttributeName: aws.String("address"),
				AttributeType: types.ScalarAttributeTypeS,
			},
		},
		KeySchema: []types.KeySchemaElement{
			{
				AttributeName: aws.String("app_token"),
				KeyType:       types.KeyTypeHash,
			}, {
				AttributeName: aws.String("address"),
				KeyType:       types.KeyTypeRange,
			},
		},
		GlobalSecondaryIndexes: []types.GlobalSecondaryIndex{
			{
				IndexName: aws.String("ByAddressIndex"),
				KeySchema: []types.KeySchemaElement{
					{
						AttributeName: aws.String("address"),
						KeyType:       types.KeyTypeHash,
					},
				},
				Projection: &types.Projection{
					ProjectionType: types.ProjectionType("ALL"),
				},
				ProvisionedThroughput: &throughput,
			},
		},
		TableName:             aws.String(TOKEN_TABLE),
		ProvisionedThroughput: &throughput,
	}
	statusTable dynamodb.CreateTableInput = dynamodb.CreateTableInput{
		AttributeDefinitions: []types.AttributeDefinition{
			{
				AttributeName: aws.String("address"),
				AttributeType: types.ScalarAttributeTypeS,
			}, {
				AttributeName: aws.String("package_name"),
				AttributeType: types.ScalarAttributeTypeS,
			},
		},
		KeySchema: []types.KeySchemaElement{
			{
				AttributeName: aws.String("address"),
				KeyType:       types.KeyTypeHash,
			}, {
				AttributeName: aws.String("package_name"),
				KeyType:       types.KeyTypeRange,
			},
		},
		GlobalSecondaryIndexes: []types.GlobalSecondaryIndex{
			{
				IndexName: aws.String("ByAddressIndex"),
				KeySchema: []types.KeySchemaElement{
					{
						AttributeName: aws.String("address"),
						KeyType:       types.KeyTypeHash,
					},
				},
				Projection: &types.Projection{
					ProjectionType: types.ProjectionType("ALL"),
				},
				ProvisionedThroughput: &throughput,
			},
		},
		TableName:             aws.String(STATUS_TABLE),
		ProvisionedThroughput: &throughput,
	}
	deployedTable dynamodb.CreateTableInput = dynamodb.CreateTableInput{
		AttributeDefinitions: []types.AttributeDefinition{
			{
				AttributeName: aws.String("address"),
				AttributeType: types.ScalarAttributeTypeS,
			}, {
				AttributeName: aws.String("package_name"),
				AttributeType: types.ScalarAttributeTypeS,
			},
		},
		KeySchema: []types.KeySchemaElement{
			{
				AttributeName: aws.String("address"),
				KeyType:       types.KeyTypeHash,
			}, {
				AttributeName: aws.String("package_name"),
				KeyType:       types.KeyTypeRange,
			},
		},
		TableName:             aws.String(DEPLOYED_TABLE),
		ProvisionedThroughput: &throughput,
	}
)

func SetLocal(local bool) {
	isRunningLocally = local
}

func CreateTables() {
	log.Println("creating tables if necessary")

	svc := createClient()
	foundTables := make(map[string]bool)

	tables, err := svc.ListTables(context.TODO(), nil)
	if err != nil {
		log.Fatalf("list tables failed: %v", err)
	}

	for _, table := range tables.TableNames {

		foundTables[table] = true
	}

	if _, ok := foundTables["AppTokens"]; ok {
		log.Println("  table exists, not recreating: AppTokens")
	} else {
		createTable(svc, tokensTable)
	}

	if _, ok := foundTables["PackageStatus"]; ok {
		log.Println("  table exists, not recreating: PackageStatus")
	} else {
		createTable(svc, statusTable)
	}

	if _, ok := foundTables["DeployedContracts"]; ok {
		log.Println("  table exists, not recreating: DeployedContracts")
	} else {
		createTable(svc, deployedTable)
	}
}

func createClient() (client *dynamodb.Client) {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		log.Fatal(err)
	}

	if isRunningLocally {
		client = dynamodb.NewFromConfig(cfg, func(o *dynamodb.Options) {
			o.BaseEndpoint = aws.String(LOCAL_DB)
		})
	} else {
		client = dynamodb.NewFromConfig(cfg)
	}

	return
}

func createTable(svc *dynamodb.Client, tableDesc dynamodb.CreateTableInput) {
	tableName := *tableDesc.TableName

	_, err := svc.CreateTable(context.TODO(), &tableDesc)
	if err != nil {
		log.Fatalf("create table %s failed: %v", tableName, err)
	}

	waiter := dynamodb.NewTableExistsWaiter(svc)
	err = waiter.Wait(context.TODO(), &dynamodb.DescribeTableInput{
		TableName: aws.String(tableName)}, waitTimeout)
	if err != nil {
		log.Fatalf("wait for table %s failed: %v", tableName, err)
	}

	log.Printf("  created: %s", tableName)
}

// eof
