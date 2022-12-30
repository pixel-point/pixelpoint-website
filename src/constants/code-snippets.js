const DEFAULT_CODE_SNIPPETS = [
  {
    name: 'Go',
    code: `package main

  import (
      "database/sql"
      "fmt"
      "log"
  
      _ "github.com/lib/pq"
  )
  
  func main() {
      connStr := "user=<user> password=<password> dbname=neondb host=<endpoint_hostname>"
      db, err := sql.Open("postgres", connStr)
      if err != nil {
          log.Fatal(err)
      }
      defer db.Close()
  
      rows, err := db.Query("select version()")
      if err != nil {
          log.Fatal(err)
      }
      defer rows.Close()
  
      var version string
      for rows.Next() {
          err := rows.Scan(&version)
          if err != nil {
              log.Fatal(err)
          }
      }
      fmt.Printf("version=%s\n", version)
  }`,
  },
  {
    name: 'Java',
    code: `Purchases.getSharedInstance().purchasePackage(
    this,
    aPackage,
    new MakePurchaseListener() {
      @Override
      public void onCompleted(
        @NonNull Purchase purchase,
        @NonNull CustomerInfo customerInfo
      ) {
        if (customerInfo.getEntitlements().get("my_entitlement_identifier").isActive()) {
          // Unlock that great "pro" content
        }
      }
  
      @Override
      public void onError(@NonNull PurchasesError error, Boolean userCancelled) {
        // No purchase
      }
    }
  );`,
  },
  {
    name: 'Cordova',
    code: `Purchases.purchasePackage(package, ({ productIdentifier, purchaserInfo }) => {
    if (typeof purchaserInfo.entitlements.active.my_entitlement_identifier !== "undefined") {
      // Unlock that great "pro" content
    }
  },
  ({error, userCancelled}) => {
    // Error making purchase
  }
);

// Note: if you are using purchaseProduct to purchase Android In-app products, an optional third parameter needs to be provided when calling purchaseProduct. You can use the package system to avoid this.

Purchases.purchaseProduct("product_id", ({ productIdentifier, purchaserInfo }) => {
}, ({error, userCancelled}) => {
    // Error making purchase
}, null, Purchases.PURCHASE_TYPE.INAPP);`,
  },
  {
    name: 'Rust',
    code: `use postgres::{Client, NoTls};

  fn main() {
   let mut client = Client::connect("user=<user> dbname=<dbname> host=pg.neon.tech password=<password>", NoTls).expect("connection error");
  
   for row in client.query("select version()", &[]).expect("query error") {
       let version: &str = row.get(0);
       println!("version: {}", version);
   }
  }`,
  },
  {
    name: 'SQLAlchemy',
    code: `import psycopg2

  # Optional: tell psycopg2 to cancel the query on Ctrl-C
  import psycopg2.extras; psycopg2.extensions.set_wait_callback(psycopg2.extras.wait_select)
  
  # You can set the password to None if it is specified in a ~/.pgpass file
  USERNAME = "<username>"
  PASSWORD = "<password>"
  HOST = "pg.neon.tech"
  PORT = "5432"
  PROJECT = "neondb"
  
  conn = psycopg2.connect(
   host=HOST,
   port=PORT,
   user=USERNAME,
   password=PASSWORD,
   database=PROJECT)
  
  with conn.cursor() as cur:
   cur.execute("SELECT 'hello neon';")
   print(cur.fetchall())`,
  },
  {
    name: 'Javascript',
    code: `import { check } from 'k6';
    import { chromium } from 'k6/x/browser';
    
    export default function () {
      const browser = chromium.launch({ headless: false });
      const page = browser.newPage();
    
      page
        .goto('https://test.k6.io/my_messages.php', { waitUntil: 'networkidle' })
        .then(() => {
          // Enter login credentials and login
          page.locator('input[name="login"]').type('admin');
          page.locator('input[name="password"]').type('123');
          
          // Wait for asynchronous operations to complete
          return Promise.all([
            page.waitForNavigation(),
            page.locator('input[type="submit"]').click(),
          ]).then(() => {
            check(page, {
              'header': page.locator('h2').textContent() == 'Welcome, admin!',
            });
          });
        }).finally(() => {
          page.close();
          browser.close();
        });
    }
    `,
  },
  {
    name: 'Swift',
    code: `Purchases.shared.purchase(package: package) {
    (transaction, customerInfo, error, userCancelled) in
  let entitlement = customerInfo.entitlements["your_entitlement_id"]
  if entitlement?.isActive == true {
    // Unlock that great "pro" content              
  }
}`,
  },
  {
    name: 'ObjectiveC',
    code: `[[RCPurchases sharedPurchases] purchasePackage:package
  withCompletion:^(RCStoreTransaction *transaction,
                  RCCustomerInfo *customerInfo,
                  NSError *error,
                  BOOL cancelled) {
if (customerInfo.entitlements[@"your_entitlement_id"].isActive) {
// Unlock that great "pro" content
}
}];`,
  },
  {
    name: 'Kotlin',
    code: `Purchases.sharedInstance.purchasePackage(
    this,
    aPackage,
    onError = { error, userCancelled -> /* No purchase */ },
    onSuccess = { product, customerInfo ->
      val entitlement = customerInfo.entitlements["my_entitlement_identifier"]
      if (entitlement?.isActive == true) {
      // Unlock that great "pro" content
    }
  })`,
  },
  {
    name: 'Flutter',
    code: `try {
    PurchaserInfo purchaserInfo = await Purchases.purchasePackage(
     package
    );
    if (purchaserInfo.entitlements.all["my_entitlement_identifier"]
     .isActive) {
     // Unlock that great "pro" content
    }
   } on PlatformException catch (e) {
    /* No purchase */ 
   }`,
  },
];

export default DEFAULT_CODE_SNIPPETS;
