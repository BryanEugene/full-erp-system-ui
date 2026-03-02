import { Cpu } from 'lucide-react';
import { PageHeader, DataStructure } from '../../components/DataStructure';

export function AssetsOverview() {
  return (
    <div className="p-6">
      <PageHeader 
        title="Asset Management Module" 
        description="Track and manage company assets including depreciation, maintenance, and transfers"
        icon={<Cpu className="w-8 h-8" />}
      />

      <div className="grid gap-6">
        <DataStructure
          title="Asset"
          description="Fixed assets and equipment master data"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'assetNumber', type: 'string', description: 'Asset number' },
            { name: 'assetName', type: 'string', description: 'Asset name' },
            { name: 'category', type: 'string', description: 'Asset category' },
            { name: 'acquisitionDate', type: 'Date', description: 'Date acquired' },
            { name: 'acquisitionCost', type: 'number', description: 'Original cost' },
            { name: 'currentValue', type: 'number', description: 'Current book value' },
            { name: 'location', type: 'string', description: 'Physical location' },
            { name: 'status', type: 'enum', description: 'Active | Disposed | Under Maintenance' },
          ]}
        />

        <DataStructure
          title="Depreciation"
          description="Asset depreciation calculations and schedules"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'assetId', type: 'string', description: 'Asset reference' },
            { name: 'depreciationMethod', type: 'enum', description: 'Straight Line | Declining Balance | Units of Production' },
            { name: 'usefulLife', type: 'number', description: 'Useful life in years' },
            { name: 'salvageValue', type: 'number', description: 'Residual value' },
            { name: 'annualDepreciation', type: 'number', description: 'Annual depreciation amount' },
            { name: 'accumulatedDepreciation', type: 'number', description: 'Total depreciation to date' },
          ]}
        />

        <DataStructure
          title="Maintenance"
          description="Asset maintenance schedules and records"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'assetId', type: 'string', description: 'Asset reference' },
            { name: 'maintenanceType', type: 'enum', description: 'Preventive | Corrective | Predictive' },
            { name: 'scheduledDate', type: 'Date', description: 'Scheduled date' },
            { name: 'completedDate', type: 'Date?', description: 'Actual completion date' },
            { name: 'cost', type: 'number', description: 'Maintenance cost' },
            { name: 'status', type: 'enum', description: 'Scheduled | In Progress | Completed' },
          ]}
        />

        <DataStructure
          title="Asset Transfer"
          description="Asset location and ownership transfers"
          fields={[
            { name: 'id', type: 'string', description: 'Unique identifier' },
            { name: 'assetId', type: 'string', description: 'Asset reference' },
            { name: 'transferDate', type: 'Date', description: 'Transfer date' },
            { name: 'fromLocation', type: 'string', description: 'Source location' },
            { name: 'toLocation', type: 'string', description: 'Destination location' },
            { name: 'fromCustodian', type: 'string', description: 'Previous custodian' },
            { name: 'toCustodian', type: 'string', description: 'New custodian' },
            { name: 'status', type: 'enum', description: 'Pending | Completed | Cancelled' },
          ]}
        />
      </div>
    </div>
  );
}
