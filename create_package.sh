#!/bin/bash

echo "Creating RideShare Deployment Package..."

# Create package directory
PACKAGE_DIR="rideshare_deployment_package"
rm -rf $PACKAGE_DIR
mkdir -p $PACKAGE_DIR

# Copy application files
echo "Copying application files..."
cp -r frontend $PACKAGE_DIR/
cp -r backend $PACKAGE_DIR/

# Copy documentation
echo "Copying documentation..."
cp README.md $PACKAGE_DIR/
cp DEPLOYMENT_GUIDE.md $PACKAGE_DIR/
cp MOBILE_APP_GUIDE.md $PACKAGE_DIR/
cp PAYMENT_INTEGRATION_GUIDE.md $PACKAGE_DIR/
cp contracts.md $PACKAGE_DIR/

# Clean up node_modules and build files
echo "Cleaning up unnecessary files..."
rm -rf $PACKAGE_DIR/frontend/node_modules
rm -rf $PACKAGE_DIR/frontend/build
rm -rf $PACKAGE_DIR/backend/__pycache__
rm -rf $PACKAGE_DIR/backend/venv
rm -rf $PACKAGE_DIR/backend/routes/__pycache__

# Create ZIP file
echo "Creating ZIP archive..."
zip -r rideshare_complete_$(date +%Y%m%d_%H%M%S).zip $PACKAGE_DIR

echo "Package created successfully!"
ls -lh rideshare_complete_*.zip

